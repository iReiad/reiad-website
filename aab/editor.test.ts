/* editor.test.ts: `aab/editor.js`, driven in a real browser.

     node aab/editor.test.ts

   The editor is the one part of this site that cannot be checked
   by reading it: a contenteditable, a sanitiser, markdown input
   rules, a slash menu and a figure toolbar, all working on a
   selection the browser owns.

   IT MOUNTS ITS OWN SURFACE. The server below answers `/` with a
   shell holding one `#editor` and the checks mount
   `createEditor()` into it, so no address can go stale under it.
   What is NOT here, deliberately: the Studio's chrome, which is
   `app/src/studio/**` and `app/studio.test.ts`. Two files
   asserting the same thing is how one asserts it wrongly.

   OPTIONAL: it needs Playwright and a browser, and it SKIPS when
   either is missing, saying which, because a skip is not a pass.

       cd app && npm install
       CHROMIUM_PATH=/path/to/chrome node aab/editor.test.ts

   `aab/tsconfig.test.json` typechecks the annotations below. A
   `!` inside a `page.evaluate` callback is the repo's usual "this
   element is in the markup": the callback runs in the browser and
   cannot reach a helper out here. */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import type { Block, EditorHandle } from "/editor.js";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = 8129;

/* ---------- Playwright, wherever it lives ---------- */

/** Playwright under whatever name `PLAYWRIGHT` gave, which is not
    a specifier tsc can resolve. Either shape of module is
    accepted, so both are described. */
interface PlaywrightModule {
  chromium?: typeof import("playwright").chromium;
  default?: { chromium?: typeof import("playwright").chromium };
}

/* Playwright is a devDependency of `app/` rather than of the root:
   it is a browser driver, and the root install is what CI runs.
   Every browser test here reaches it by this path, and the one
   that did not skipped on a machine that had a browser all along. */
const WHERE = [
  process.env.PLAYWRIGHT,
  "playwright",
  "../app/node_modules/playwright/index.mjs",
].filter((s): s is string => Boolean(s));

let chromium: typeof import("playwright").chromium | undefined;
for (const spec of WHERE) {
  try {
    const mod: PlaywrightModule = await import(spec);
    chromium = mod.chromium ?? mod.default?.chromium;
    if (chromium) break;
  } catch { /* try the next place */ }
}
if (!chromium) {
  console.log("No Playwright here, so the editor's checks are skipped.");
  console.log("  cd app && npm install"
    + "   (or: PLAYWRIGHT=/path/to/playwright node aab/editor.test.ts)");
  process.exit(0);
}

/* ---------- the surface, and the policy it runs under ---------- */

/* The real policy, read out of `aab/_headers` rather than copied,
   because a copy is a second list and this repository has been
   bitten by one of those more than once.

   It is here because a harness that drops the CSP cannot tell you
   whether an image or a fetch is allowed: the page looks identical
   either way, and the editor's photo path is governed by exactly
   this line. Thrown rather than defaulted to nothing, because a
   harness serving an empty policy would answer every check below
   and none of them would be about the policy. */
const declared = (await readFile(join(ROOT, "_headers"), "utf8"))
  .match(/Content-Security-Policy: (.+)/)?.[1];
if (!declared) throw new Error("aab/_headers carries no Content-Security-Policy");
const CSP = declared.trim();

/* The class is load-bearing, not decoration. `.paste-area` is what
   gives the surface its 320px min-height, and without it the
   editor is one line tall: the caret lands outside every block,
   `formatBlock` has nothing to replace and every markdown rule
   below silently does nothing. Which is the exact failure those
   rules were written for. The rest matches `app/src/studio/
   Editor.tsx`, so this surface is the one a writer gets.

   `/fallback.css`, not `/styles.css`. Nothing has been served at
   the second since the stylesheet moved into Next: it carries a
   content hash now, which a hand-written shell cannot know. */
const SHELL = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
  + '<title>editor.test.ts</title>'
  + '<link rel="stylesheet" href="/fallback.css"></head>'
  + '<body><main id="main"><div class="wrap">'
  + '<div id="editor" class="paste-area" contenteditable="true" role="textbox"'
  + ' aria-multiline="true" aria-label="Article body"'
  + ' data-placeholder="Write, or paste."></div>'
  + "</div></main></body></html>";

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp",
  ".ico": "image/x-icon", ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(String(req.url), "http://x").pathname);
  if (path === "/") {
    res.writeHead(200, { "Content-Type": TYPES[".html"], "Content-Security-Policy": CSP });
    res.end(SHELL);
    return;
  }
  try {
    // normalize() collapses "..", and the prefix check refuses
    // anything that still climbs out of aab/.
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise<void>((ready) => { server.listen(PORT, "127.0.0.1", ready); });

/* ---------- the checks ---------- */

let passed = 0;
const failures: string[] = [];
const check = (name: string, condition: unknown, detail: unknown = ""): void => {
  if (condition) { passed++; return; }
  failures.push(name + (detail ? `\n    ${detail}` : ""));
};

/** What an element says. `textContent()` and `getAttribute()` both
    answer `string | null`, and a null here is a selector that found
    nothing rather than an element with nothing in it, so it throws.
    Answering "" instead would turn a check reading `!said(x)
    .includes(y)` into a pass on an element that is missing. */
const said = (value: string | null): string => {
  if (value === null) throw new Error("nothing there to read");
  return value;
};

/* A browser, or a clean skip that says which way it failed to
   start. `npm i` gets the library and not the browser, and
   Playwright refuses to launch one it did not download itself
   unless it is told where one is. */
let browser: import("playwright").Browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
} catch (err) {
  console.log("Playwright is here but there is no browser to drive,"
    + " so the editor's checks are skipped.");
  console.log(`  ${(err instanceof Error ? err.message : String(err)).split("\n")[0]}`);
  console.log("  npx playwright install chromium"
    + "   (or: CHROMIUM_PATH=/path/to/chrome node aab/editor.test.ts)");
  server.close();
  process.exit(0);
}

/* ---------- the harness the editor is mounted into ---------- */

/** What the page hands back out. Everything `createEditor` is
    given is recorded here, because a callback that never fires is
    the shape of half the bugs in this file's history. */
interface Harness {
  editor: EditorHandle;
  /** Build a second editor over the same root, after `destroy()`. */
  mount(): void;
  language: string;
  changes: number;
  toasts: string[];
  photoPicks: number;
  saves: number;
  publishes: number;
  /** Every keydown that reached `window`, by name. Ctrl+K must not. */
  keysAtWindow: string[];
}

declare global {
  interface Window { harness: Harness }
}

const context = await browser.newContext({
  viewport: { width: 1400, height: 1100 },
  // The service worker would serve its own precached copies of the
  // site's modules, which is the wrong thing to test and a very
  // confusing way to find that out.
  serviceWorkers: "block",
});
const page = await context.newPage();

const pageErrors: string[] = [];
page.on("pageerror", (e) => pageErrors.push(e.message));

await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "domcontentloaded" });

await page.evaluate(async () => {
  const { createEditor } = await import("/editor.js");
  const root = document.querySelector<HTMLElement>("#editor")!;
  const mount = (): EditorHandle => createEditor({
    root,
    onChange: () => { window.harness.changes++; },
    lang: () => window.harness.language,
    toast: (message: string) => { window.harness.toasts.push(message); },
    pickPhoto: () => { window.harness.photoPicks++; },
    onSave: () => { window.harness.saves++; },
    onPublish: () => { window.harness.publishes++; },
  });
  const harness: Harness = {
    editor: undefined as unknown as EditorHandle,
    mount() { harness.editor = mount(); },
    language: "en",
    changes: 0, toasts: [], photoPicks: 0, saves: 0, publishes: 0,
    keysAtWindow: [],
  };
  window.harness = harness;
  addEventListener("keydown", (e) => { harness.keysAtWindow.push(e.key); });
  harness.mount();
});

/* ---------- what the surface holds, and what it would publish ---------- */

const html = (): Promise<string> =>
  page.evaluate(() => document.querySelector("#editor")!.innerHTML);

/** What the Studio would actually publish, after the sanitiser in
    `/editor.js`. A block the editor draws and the sanitiser drops
    is a block that looks right and arrives plain. */
const published = (): Promise<string> => page.evaluate(async () =>
  (await import("/editor.js")).sanitize(document.querySelector("#editor")!.innerHTML));

const clean = (html: string): Promise<string> =>
  page.evaluate(async (source) => (await import("/editor.js")).sanitize(source), html);

const empty = async (): Promise<void> => {
  await page.evaluate(() => { document.querySelector("#editor")!.innerHTML = ""; });
  await page.click("#editor");
};
const seeded = async (): Promise<void> => {
  await page.evaluate(() => { document.querySelector("#editor")!.innerHTML = "<p><br></p>"; });
  await page.click("#editor");
};
const set = async (markup: string): Promise<void> => {
  await page.evaluate((value) => { window.harness.editor.setHtml(value); }, markup);
  await page.click("#editor");
};

const slashItems = (): Promise<string[]> => page.locator(".slash-item").allTextContents();
const menuOpen = (): Promise<boolean> => page.locator(".slash-menu").isVisible();
const settle = (ms = 280): Promise<void> => page.waitForTimeout(ms);

/* ============================================================
   1. WHAT THE MODULE IS
   ============================================================ */

{
  const shape = await page.evaluate(async () => {
    const module: Record<string, unknown> = await import("/editor.js");
    return { names: Object.keys(module).sort(), buildPage: module.buildPage === undefined };
  });

  /* `buildPage()` was `studio.js`'s own article renderer, the
     second one on this site, and it drifted from the server's
     twice. The file that held it is in `archive/`; what this
     asserts is that it did not follow the editor into the module
     both Studios share. */
  check("the second article renderer did not come with the editor", shape.buildPage);
  check("and nothing else here renders a page either",
    !shape.names.some((n) => /^(build|render)/.test(n)), shape.names.join(", "));

  for (const name of ["sanitize", "createEditor", "KEEP_CLASSES", "slugify",
    "readingStats", "textToHtml", "escapeHtml", "dropUntouchedCaptions",
    "CAPTION_HINT", "WORDS", "figureHtml", "processImage"]) {
    check(`the module still exports ${name}`, shape.names.includes(name), shape.names.join(", "));
  }
}

/* ============================================================
   2. THE SANITISER

   Both Studios run pasted HTML through this on the way in and the
   article through it again on the way out. It is the browser's
   half of the three-place rule in CLAUDE.md: a class allowed here
   and nowhere else is a block that arrives plain.
   ============================================================ */

{
  const CASES: Array<[name: string, input: string, wanted: RegExp | string]> = [
    ["a script is removed whole", "<p>Before</p><script>alert(1)</script><p>After</p>",
      "<p>Before</p>\n<p>After</p>"],
    ["so are style, form, input and button",
      "<style>p{}</style><form><input><button>x</button></form><p>Kept</p>", "<p>Kept</p>"],
    ["h1 becomes the site's top heading", "<h1>One</h1>", "<h2>One</h2>"],
    ["h4 and h6 become h3", "<h4>Four</h4><h6>Six</h6>", "<h3>Four</h3>\n<h3>Six</h3>"],
    ["b and i become strong and em", "<p><b>bold</b> <i>it</i></p>",
      "<p><strong>bold</strong> <em>it</em></p>"],
    ["an underline is emphasis, not a link", "<p><u>u</u></p>", "<p><em>u</em></p>"],
    ["a span dissolves and keeps its words",
      "<p>a <span style=\"color:red\">b</span> c</p>", "<p>a b c</p>"],
    ["a div holding blocks dissolves rather than becoming a paragraph",
      "<div><p>one</p><p>two</p></div>", "<p>one</p>\n<p>two</p>"],
    ["a div holding only words becomes a paragraph", "<div>just text</div>", "<p>just text</p>"],
    ["a note box survives", '<div class="note">A note</div>', '<div class="note">A note</div>'],
    ["a worked example survives", '<div class="ex">e</div>', '<div class="ex">e</div>'],
    ["a checklist survives", '<ul class="checklist"><li>c</li></ul>',
      '<ul class="checklist"><li>c</li></ul>'],
    ["so do numbered steps", '<ol class="step-list"><li>s</li></ol>',
      '<ol class="step-list"><li>s</li></ol>'],
    ["a class the stylesheet does not know is dropped",
      '<p class="MsoNormal">text</p>', "<p>text</p>"],
    ["a kept class on a tag that may not carry one is dropped too",
      '<p><strong class="note">x</strong></p>', "<p><strong>x</strong></p>"],
    ["figure.wide keeps its class", '<figure class="wide"><img src="/media/x.webp" alt="a"></figure>',
      '<figure class="wide"><img src="/media/x.webp" alt="a"></figure>'],
    ["id, style and data attributes are scrubbed",
      '<p id="x" style="color:red" data-y="1">text</p>', "<p>text</p>"],
    ["a link keeps href and title and gains rel",
      '<p><a href="https://example.com" target="_blank" title="t">link</a></p>',
      '<p><a href="https://example.com" title="t" rel="noopener">link</a></p>'],
    ["a javascript: link stops being a link",
      '<p><a href="javascript:alert(1)">not a link</a></p>', "<p>not a link</p>"],
    ["a javascript: image loses its source",
      '<figure><img src="javascript:alert(1)" alt="a"></figure>', '<figure><img alt="a"></figure>'],
    ["a pasted photo is allowed to stay a data: URL",
      '<figure><img src="data:image/gif;base64,R0lGODlh" alt="a"></figure>', /src="data:image\/gif/],
    ["a table at the top level gets the phone scroller",
      '<table><tr><td colspan="2">a</td></tr></table>', /^<div class="table-scroll"><table>/],
    ["a column span survives it", '<table><tr><td colspan="2">a</td></tr></table>', /colspan="2"/],
    ["an empty paragraph is dropped", "<p>text</p><p>   </p>", "<p>text</p>"],
    ["a paragraph holding only a photo is not",
      '<p><img src="/media/x.webp"></p>', '<p><img src="/media/x.webp"></p>'],
    ["bare words at the top level become a paragraph",
      "Just some words<p>and a para</p>", "<p>Just some words</p>\n<p>and a para</p>"],
    ["blocks come back one to a line", "<p>a</p><p>b</p>", "<p>a</p>\n<p>b</p>"],
    ["a preformatted block becomes prose, because nothing styles one",
      "<pre>code block</pre>", "<p>code block</p>"],
  ];

  for (const [name, input, wanted] of CASES) {
    const out = await clean(input);
    check(name, typeof wanted === "string" ? out === wanted : wanted.test(out), out);
  }
}

/* ============================================================
   3. WHAT IS IN THE EDITOR, MEASURED
   ============================================================ */

{
  const measured = await page.evaluate(async () => {
    const m = await import("/editor.js");
    return {
      typed: m.slugify("German Alphabets"),
      long: m.slugify("How the Dhaka Stock Exchange actually works"),
      apostrophe: m.slugify("Bangladesh's banks"),
      nothing: m.slugify("!!!"),
      stats: m.readingStats(
        "<p>The DSEX is a free-float weighted index.</p><figure><img src=\"x\"></figure>"),
      short: m.readingStats("<p>one two</p>"),
      lines: m.textToHtml("one\ntwo\n\nthree <b>x</b>"),
      escaped: m.escapeHtml("<a href=\"x\">&'"),
      hint: m.CAPTION_HINT,
      dropped: m.dropUntouchedCaptions(
        `<figure><figcaption>${m.CAPTION_HINT}, or delete this line</figcaption></figure>`
        + "<figure><figcaption>Mine</figcaption></figure>"),
      classes: [...m.KEEP_CLASSES],
      languages: Object.keys(m.WORDS),
      bnNote: m.WORDS.bn.note,
      enNote: m.WORDS.en.note,
    };
  });

  /* A slug becomes a URL and only some strings can be one. This
     used to take whatever was typed, so "German Alphabets" stayed
     that in one place while the server stored "germanalphabets". */
  check("a typed file name is tidied into a usable slug",
    measured.typed === "german-alphabets", measured.typed);
  check("a long headline stops at about forty characters, never mid-word",
    measured.long === "how-the-dhaka-stock-exchange-actually", measured.long);
  check("an apostrophe vanishes rather than becoming a hyphen",
    measured.apostrophe === "bangladeshs-banks", measured.apostrophe);
  check("a headline with nothing usable in it still gets a slug",
    /^article-\d{4}-\d{2}-\d{2}$/.test(measured.nothing), measured.nothing);

  check("the word count is the words, not the markup",
    measured.stats.words === 7, JSON.stringify(measured.stats));
  check("and the photos are counted", measured.stats.photos === 1);
  check("a two-word piece still reads in a minute rather than none",
    measured.short.minutes === 1);

  check("plain text splits into paragraphs on a blank line",
    measured.lines === "<p>one<br>two</p>\n<p>three &lt;b&gt;x&lt;/b&gt;</p>", measured.lines);
  check("and a single newline is a line break inside one",
    measured.lines.includes("one<br>two"));
  check("HTML inside plain text is escaped, not honoured",
    measured.escaped === "&lt;a href=&quot;x&quot;&gt;&amp;&#39;", measured.escaped);

  check("a caption the writer never touched does not ship",
    !measured.dropped.includes(measured.hint), measured.dropped);
  check("and one they wrote does", measured.dropped.includes("Mine"), measured.dropped);

  /* check-css.ts reads this list out of editor.js by name and
     fails if it disagrees with the server's. These are the ones an
     article's own blocks are made of. */
  for (const cls of ["note", "ex", "at-a-glance", "side-note", "step-list",
    "checklist", "figures", "table-scroll", "wide", "full", "lead-photo"]) {
    check(`the class allowlist still carries ${cls}`, measured.classes.includes(cls));
  }

  check("the block copy comes in both of the site's languages",
    measured.languages.join(",") === "en,bn", measured.languages.join(","));
  check("and the two are not the same words",
    measured.bnNote !== measured.enNote, `${measured.bnNote} / ${measured.enNote}`);
}

/* ============================================================
   4. MARKDOWN, INCLUDING THE FIRST LINE

   An empty editor has no block for the caret to sit in. That is
   the state every new article starts in, and it used to be the
   broken one.
   ============================================================ */

await empty();
await page.keyboard.type("## First line of a new piece");
await settle();
check("## works on the first line of an empty editor",
  /<h2>First line of a new piece<\/h2>/.test(await html()), await html());

await empty();
await page.keyboard.type("- first bullet of a new piece");
await settle();
check("- works on the first line of an empty editor",
  /<ul>[\s\S]*<li>first bullet/.test(await html()), await html());

{
  const RULES: Array<[typed: string, pattern: RegExp, name: string]> = [
    ["## A heading", /<h2>A heading<\/h2>/, "## makes an H2"],
    ["# A heading", /<h2>A heading<\/h2>/, "so does a single #"],
    ["### A sub-heading", /<h3>A sub-heading<\/h3>/, "### makes an H3"],
    ["#### A sub-heading", /<h3>A sub-heading<\/h3>/, "and so does anything deeper"],
    ["- an item", /<ul>[\s\S]*<li>an item/, "- makes a bullet list"],
    ["* an item", /<ul>[\s\S]*<li>an item/, "* does too"],
    ["+ an item", /<ul>[\s\S]*<li>an item/, "and so does +"],
    ["1. an item", /<ol>[\s\S]*<li>an item/, "1. makes a numbered list"],
    ["1) an item", /<ol>[\s\S]*<li>an item/, "1) does too"],
    ["> quoted", /<blockquote>quoted/, "> makes a blockquote"],
    ["--- ", /<hr>/, "--- makes a divider"],
  ];
  for (const [typed, pattern, name] of RULES) {
    await seeded();
    await page.keyboard.type(typed);
    await settle();
    check(name, pattern.test(await html()), await html());
  }
}

await seeded();
await page.keyboard.type("I paid 1. then 2.");
await settle();
check("a marker mid-sentence is left alone", !/<ol>/.test(await html()), await html());

await seeded();
await page.keyboard.type("##x A heading");
await settle();
check("and a marker with something stuck to it is not a marker",
  /<p>##x A heading<\/p>/.test(await html()), await html());

{
  await seeded();
  const before = await page.evaluate(() => window.harness.changes);
  await page.keyboard.type("## A heading");
  await settle();
  check("a rule that fires tells the page something changed",
    await page.evaluate(() => window.harness.changes) > before);
}

/* ============================================================
   5. THE SLASH MENU
   ============================================================ */

await seeded();
await page.keyboard.type("/");
await settle();
check("slash opens the menu", await menuOpen());
check("it is a listbox, so a screen reader can read it",
  await page.getAttribute(".slash-menu", "role") === "listbox");
check("and it says what it is for",
  said(await page.getAttribute(".slash-menu", "aria-label")).length > 0);
check("the menu offers the site's own blocks",
  (await slashItems()).join("|").includes("Note"));

{
  /* Counted against the list the editor hands out rather than
     against a number typed here, which is the rule at the top of
     CLAUDE.md: a block added to BLOCKS and not to the menu is what
     this would catch. */
  const blocks: number = await page.evaluate(() => window.harness.editor.blocks.length);
  check("every block the editor has is on the menu",
    (await slashItems()).length === blocks, `${(await slashItems()).length} of ${blocks}`);
  check("and the first one is the one that would run",
    said(await page.locator('.slash-item[aria-selected="true"]').textContent())
      .startsWith("Heading"));
}

await page.keyboard.press("ArrowDown");
await settle(150);
check("an arrow moves the choice",
  said(await page.locator('.slash-item[aria-selected="true"]').textContent())
    .startsWith("Sub-heading"));

await page.keyboard.type("list");
await settle();
check("typing filters it", (await slashItems()).length === 3, (await slashItems()).join("|"));
await page.keyboard.type("zzz");
await settle();
check("a query that matches nothing closes it rather than showing nothing",
  !(await menuOpen()));

await seeded();
await page.keyboard.type("/note");
await settle();
{
  const shown = await slashItems();
  check("a query that names one block shows one",
    shown.length === 1 && shown[0].includes("Note"), shown.join("|"));
}
await page.keyboard.press("Enter");
await settle(400);
check("Enter inserts the note box", /<div class="note">/.test(await html()), await html());
check("the typed /note is cleaned up", !(await html()).includes("/note"));
check("the menu closes", !(await menuOpen()));
/* The class has to survive the Studio's own sanitiser, or the
   server never sees it and the whole block vocabulary is
   decorative. */
check("the note box survives sanitize()",
  /<div class="note">/.test(await published()), await published());

await seeded();
await page.keyboard.type("/");
await settle(200);
await page.keyboard.press("Escape");
await settle(200);
check("Escape closes it", !(await menuOpen()));

await seeded();
await page.keyboard.type("see https:/");
await settle();
check("a slash inside a word is just a slash", !(await menuOpen()));

await seeded();
await page.keyboard.type("/key p");
await settle();
check("a space ends the query, because a block name is one word here",
  !(await menuOpen()));

await seeded();
await page.keyboard.type("/example");
await settle();
await page.locator(".slash-item").first().click();
await settle(400);
check("a row can be clicked as well as chosen",
  /<div class="ex">/.test(await html()), await html());

{
  const before = await page.evaluate(() => window.harness.photoPicks);
  await seeded();
  await page.keyboard.type("/photo");
  await settle();
  await page.keyboard.press("Enter");
  await settle(300);
  check("Photo opens the picker rather than inserting markup",
    await page.evaluate(() => window.harness.photoPicks) === before + 1);
  check("and leaves no markup behind", !(await html()).includes("figure"), await html());
}

await seeded();
await page.keyboard.type("/table");
await settle();
await page.keyboard.press("Enter");
await settle(400);
check("a table gets the phone scroller",
  /<div class="table-scroll">/.test(await published()), await published());
check("and the marker for where the writing starts never ships",
  !(await html()).includes("data-fill"), await html());

/* The block copy is written in the language the piece is in: a
   Bangla piece with an English "At a glance" over its Bangla facts
   is a piece with an English word in it. */
{
  const bn: string = await page.evaluate(async () =>
    (await import("/editor.js")).WORDS.bn.note);
  await page.evaluate(() => { window.harness.language = "bn"; });
  await seeded();
  await page.keyboard.type("/point");
  await settle();
  await page.keyboard.press("Enter");
  await settle(400);
  check("a block inserted into a Bangla piece is written in Bangla",
    (await html()).includes(bn), await html());
  await page.evaluate(() => { window.harness.language = "en"; });
}

/* ============================================================
   6. THE BLOCKS A LONG READ IS MADE OF

   Each of these was typed as raw HTML into a file by hand before
   the Studio could make one, which is the thing the Studio is for
   not doing. A block is finished when it survives the sanitiser.
   ============================================================ */

{
  const BLOCKS: Array<[key: string, wanted: RegExp]> = [
    ["at-a-glance", /<div class="at-a-glance"><p class="at-a-glance-label">/],
    ["side-note", /<div class="side-note"><p class="side-note-label">/],
    ["step-list", /<ol class="step-list"><li>/],
    ["checklist", /<ul class="checklist"><li>/],
    ["figures", /<div class="figures"><div class="fig">/],
    ["note", /<div class="note">/],
    ["ex", /<div class="ex">/],
  ];
  for (const [key, wanted] of BLOCKS) {
    await set("<p><br></p>");
    await page.evaluate((k) => {
      const block: Block | undefined = window.harness.editor.byKey(k);
      if (!block) throw new Error(`no block keyed ${k}`);
      window.harness.editor.run(block);
    }, key);
    await settle(200);
    check(`${key} arrives whole and survives sanitize()`,
      wanted.test(await published()), await published());
  }

  check("a key nothing is filed under finds nothing",
    await page.evaluate(() => window.harness.editor.byKey("nope") === undefined));

  /* execCommand normalises what it inserts against what is already
     there, and its idea of normal is not ours: a checklist next to
     a numbered list had its items folded into that list and its
     class dropped. So these are placed by hand, and where they land
     is the thing to check. */
  await set("<p>A full paragraph.</p>");
  await page.evaluate(() => {
    const note = window.harness.editor.byKey("note");
    if (note) window.harness.editor.run(note);
  });
  await settle(200);
  check("a block lands after the paragraph the caret is in",
    /<p>A full paragraph\.<\/p><div class="note">/.test(await html()), await html());
  check("and one place to carry on typing comes with it",
    /<div class="note">[\s\S]*<\/div><p><br><\/p>$/.test(await html()), await html());

  await set("<p><br></p>");
  await page.evaluate(() => {
    const note = window.harness.editor.byKey("note");
    if (note) window.harness.editor.run(note);
    const example = window.harness.editor.byKey("ex");
    if (example) window.harness.editor.run(example);
  });
  await settle(200);
  check("two blocks in a row do not leave a blank line between them",
    /<div class="note">[\s\S]*<\/div><div class="ex">/.test(await html()), await html());
}

/* ============================================================
   7. THE FIGURE TOOLBAR

   Alt text had no way in at all: it was set once from the file
   name and never editable, so pre-flight could warn about it and
   offer nothing to do about it.
   ============================================================ */

const PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

await page.evaluate((src) => {
  document.querySelector("#editor")!.innerHTML =
    `<figure><img src="${src}" width="200" height="200"></figure><p>after</p>`;
}, PIXEL);
await page.click("#editor img");
await settle();

check("clicking a photo opens its toolbar", await page.locator(".fig-bar").isVisible());
check("it offers a size, a shape and a part to keep",
  (await page.locator(".fig-group .mono").allTextContents()).join("|") === "Size|Shape|Keep",
  (await page.locator(".fig-group .mono").allTextContents()).join("|"));
/* The chip is labelled "Alt", not "Alt text". It was shortened
   when the bar was redrawn and the old check went on matching the
   longer name, so it failed on a selector rather than on the
   behaviour. */
check("the toolbar offers alt text",
  (await page.locator(".fig-bar .chip").allTextContents()).some((c) => c.startsWith("Alt")));

await page.locator('.fig-bar .chip:has-text("Wide")').click();
await settle();
check("Wide sets the class", /<figure class="wide">/.test(await html()), await html());
check("and it survives sanitize()", /<figure class="wide">/.test(await published()));
check("and the chip says which one is on",
  await page.locator('.fig-bar .chip:has-text("Wide")').getAttribute("aria-pressed") === "true");

/* Each set is exclusive, so a figure can never be both wide and
   full and the markup never accumulates the history of what was
   tried. */
await page.locator('.fig-bar .chip:has-text("Full")').click();
await settle();
check("choosing another size clears the first",
  /<figure class="full">/.test(await html()), await html());

await page.locator('.fig-bar .chip:has-text("Square")').click();
await settle();
check("a shape is a second, separate choice",
  /<figure class="full frame-square">/.test(await html()), await html());
await page.locator('.fig-bar .chip:has-text("Top")').click();
await settle();
check("and which part to keep is a third",
  /<figure class="full frame-square focus-top">/.test(await html()), await html());
check("all three survive sanitize()",
  /<figure class="full frame-square focus-top">/.test(await published()), await published());

page.once("dialog", (d) => d.accept("A chart of DSEX returns"));
await page.locator(".fig-bar .chip").filter({ hasText: /^Alt/ }).click();
await settle(400);
check("alt text reaches the image",
  (await html()).includes('alt="A chart of DSEX returns"'), await html());
check("and the chip says the photo has some now",
  said(await page.locator(".fig-bar .chip").filter({ hasText: /^Alt/ }).textContent())
    .includes("✓"));

await page.locator(".fig-bar .chip").filter({ hasText: /^Lead/ }).click();
await settle();
check("a photo can be marked as the one the share card is made from",
  (await html()).includes("lead-photo"), await html());

/* One lead photo per piece: it is the one the share card is made
   from, and two of them is a question with no answer. */
await page.evaluate((src) => {
  document.querySelector("#editor")!.innerHTML =
    `<figure class="lead-photo"><img id="first" src="${src}" width="60" height="60"></figure>`
    + `<figure><img id="second" src="${src}" width="60" height="60"></figure>`;
}, PIXEL);
await page.click("#editor img#second");
await settle();
await page.locator(".fig-bar .chip").filter({ hasText: /^Lead/ }).click();
await settle();
check("marking a second one takes the mark off the first",
  (await page.locator("#editor figure.lead-photo").count()) === 1,
  await html());

await page.evaluate((src) => {
  document.querySelector("#editor")!.innerHTML =
    `<figure><img src="${src}" width="60" height="60"></figure>`
    + "<p>one</p><p>two</p><p>three</p><p>four</p><p>five</p><p>six</p><p>seven</p>";
}, PIXEL);
await page.click("#editor img");
await settle();
page.once("dialog", (d) => d.dismiss());
await page.locator('.fig-bar .chip:has-text("Remove")').click();
await settle();
check("Remove asks first, and leaves the photo when the answer is no",
  (await page.locator("#editor figure").count()) === 1);
page.once("dialog", (d) => d.accept());
await page.locator('.fig-bar .chip:has-text("Remove")').click();
await settle();
check("and takes the whole figure out when it is yes",
  (await page.locator("#editor figure").count()) === 0, await html());
check("the toolbar goes with it", !(await page.locator(".fig-bar").isVisible()));

await page.evaluate((src) => {
  document.querySelector("#editor")!.innerHTML =
    `<figure><img src="${src}" width="60" height="60"></figure>`
    + "<p>one</p><p>two</p><p>three</p><p>four</p><p>five</p><p>six</p><p>seven</p>";
}, PIXEL);
await page.click("#editor img");
await settle();
check("the toolbar is back for another photo", await page.locator(".fig-bar").isVisible());
await page.locator("#editor p").last().click();
await settle();
check("and clicking anything that is not a photo puts it away",
  !(await page.locator(".fig-bar").isVisible()));

/* ============================================================
   8. PASTE AND DROP

   A paste is the one way arbitrary HTML gets into this site, so
   it goes through the sanitiser on the way in as well as on the
   way out.
   ============================================================ */

await seeded();
await page.evaluate((markup) => {
  const data = new DataTransfer();
  data.setData("text/html", markup);
  const root = document.querySelector<HTMLElement>("#editor")!;
  root.focus();
  root.dispatchEvent(new ClipboardEvent("paste",
    { clipboardData: data, bubbles: true, cancelable: true }));
}, "<div style=\"x\"><scr" + "ipt>alert(1)</scr" + "ipt>"
  + "<p class=\"MsoNormal\">Pasted <b>text</b></p></div>");
await settle(400);
{
  const body = await html();
  check("a pasted script does not arrive", !/alert\(1\)/.test(body), body);
  check("nor does the pasting app's own class", !/MsoNormal/.test(body), body);
  check("nor its wrapper div", !/<div/.test(body), body);
  check("and the words arrive in the site's own tags",
    /<p>Pasted <strong>text<\/strong><\/p>/.test(body), body);
}

await seeded();
await page.evaluate(() => {
  const data = new DataTransfer();
  data.setData("text/plain", "one\ntwo\n\nthree <b>x</b>");
  const root = document.querySelector<HTMLElement>("#editor")!;
  root.focus();
  root.dispatchEvent(new ClipboardEvent("paste",
    { clipboardData: data, bubbles: true, cancelable: true }));
});
await settle(400);
check("plain text pasted keeps its blank-line breaks",
  /<p>one<br>two<\/p>/.test(await html()), await html());
check("and HTML typed inside it stays words",
  (await html()).includes("&lt;b&gt;x&lt;/b&gt;"), await html());
check("the blank block the insert leaves behind does not reach the database",
  !/<p>\s*<\/p>/.test(await published()), await published());

check("dragging photos over the editor marks it, and leaving unmarks it",
  await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>("#editor")!;
    const data = new DataTransfer();
    data.items.add(new File([new Uint8Array([1])], "x.png", { type: "image/png" }));
    root.dispatchEvent(new DragEvent("dragover",
      { dataTransfer: data, bubbles: true, cancelable: true }));
    const during = root.classList.contains("drop-target");
    root.dispatchEvent(new DragEvent("dragleave", { dataTransfer: data, bubbles: true }));
    return during && !root.classList.contains("drop-target");
  }));

/* ============================================================
   9. A PHOTO, END TO END

   Re-encoded in the browser and held as a data: URL until publish.
   `aab/studio-publish.test.ts` is the other half of this: what
   happens to that URL on the way to R2.
   ============================================================ */

await set("<p><br></p>");
{
  const before = await page.evaluate(() => window.harness.toasts.length);
  await page.evaluate(async () => {
    const png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk"
      + "+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const bytes = Uint8Array.from(atob(png), (c) => c.charCodeAt(0));
    await window.harness.editor.insertImages(
      [new File([bytes], "A chart of returns.png", { type: "image/png" })]);
  });
  await settle(400);
  const body = await html();
  check("a photo handed to the editor becomes a figure", /<figure>/.test(body), body.slice(0, 200));
  check("re-encoded rather than embedded as it arrived",
    /src="data:image\/(webp|jpeg)/.test(body), body.slice(0, 120));
  check("with the file name as a first draft of the alt text",
    body.includes('alt="A chart of returns"'), body.slice(0, 300));
  check("and it says it is working while it does",
    await page.evaluate(() => window.harness.toasts.length) > before);

  /* The prompt the figure carries and the prompt the dropper looks
     for are two halves of one string. `piece.ts` publishes
     `dropUntouchedCaptions(sanitize(html))`, so this is that pair
     over what the editor actually produced. */
  const hint: string = await page.evaluate(async () => (await import("/editor.js")).CAPTION_HINT);
  check("the caption arrives as a prompt", body.includes(hint), body.slice(0, 400));
  const shipped: string = await page.evaluate(async () => {
    const m = await import("/editor.js");
    return m.dropUntouchedCaptions(m.sanitize(document.querySelector("#editor")!.innerHTML));
  });
  check("and a prompt nobody edited is not published",
    !shipped.includes(hint), shipped.slice(0, 200));
  check("while the photo it was under is", /<img src="data:image\//.test(shipped));
}

/* Focus landing on an untouched caption selects it, so the first
   thing typed replaces the prompt rather than joining it. */
{
  const selected = await page.evaluate(async () => {
    const m = await import("/editor.js");
    const root = document.querySelector<HTMLElement>("#editor")!;
    root.innerHTML = m.figureHtml({ url: "/media/x.webp", width: 10, height: 10 }, "alt words");
    const caption = root.querySelector("figcaption")!;
    caption.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    const prompted = String(getSelection());
    caption.textContent = "The writer's own words";
    getSelection()!.removeAllRanges();
    caption.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    return { prompted, theirs: String(getSelection()) };
  });
  check("an untouched caption is selected whole", selected.prompted.length > 0, selected.prompted);
  check("and one the writer wrote is left alone", selected.theirs === "", selected.theirs);
}

/* AND THE SAME THING WITH A REAL CLICK, which is how everybody
   actually reaches a caption.

   The two checks above dispatch `focusin` themselves, so they pass
   whether or not the handler survives a click, and they did while
   it did not: `focusin` fires on mousedown, and the browser then
   places the caret where the pointer landed on mouseup, collapsing
   the selection the handler had just made. The prompt stayed put
   and the writer typed into the middle of it.

   A check that synthesises the event it is testing cannot see
   that. This one presses the mouse. */
{
  await page.evaluate(async () => {
    const m = await import("/editor.js");
    const root = document.querySelector<HTMLElement>("#editor")!;
    root.innerHTML = m.figureHtml({ url: "/media/x.webp", width: 10, height: 10 }, "alt words");
    getSelection()!.removeAllRanges();
  });
  await page.click("#editor figcaption");
  await settle(120);
  const clicked = await page.evaluate(() => String(getSelection()));
  check("clicking an untouched caption selects it too", clicked.length > 0, clicked);

  /* And what the selection is FOR: the first thing typed replaces
     the prompt instead of landing inside it. */
  await page.keyboard.type("Dhaka at dawn");
  await settle(120);
  const after = await page.evaluate(() =>
    document.querySelector("#editor figcaption")?.textContent ?? "");
  check("so typing replaces the prompt rather than joining it",
    after.trim() === "Dhaka at dawn", after);

  /* A caption the writer has already written is not taken over on
     a click either, or every visit to one would wipe it. */
  await page.evaluate(() => { getSelection()!.removeAllRanges(); });
  await page.click("#editor figcaption");
  await settle(120);
  const written = await page.evaluate(() => String(getSelection()));
  check("and a written caption is still left alone on a click",
    written === "", written);
}

/* ============================================================
   10. THE KEYBOARD
   ============================================================ */

await set("<p>Some text.</p>");
{
  const before = await page.evaluate(() =>
    ({ saves: window.harness.saves, publishes: window.harness.publishes }));
  await page.keyboard.press("Control+s");
  await settle(200);
  await page.keyboard.press("Control+Enter");
  await settle(200);
  const after = await page.evaluate(() =>
    ({ saves: window.harness.saves, publishes: window.harness.publishes }));
  check("Ctrl+S saves", after.saves === before.saves + 1);
  check("Ctrl+Enter publishes", after.publishes === before.publishes + 1);
}

/* The site binds Ctrl+K to search, on window. Inside the editor a
   link is the more useful thing, so it must not bubble there. */
await page.evaluate(() => { window.harness.keysAtWindow.length = 0; });
page.once("dialog", (d) => d.accept("https://example.com/x"));
await page.evaluate(() => {
  getSelection()!.selectAllChildren(document.querySelector("#editor p")!);
});
await page.keyboard.press("Control+k");
await settle(400);
check("Ctrl+K links the selection",
  /<a href="https:\/\/example\.com\/x">Some text\.<\/a>/.test(await html()), await html());
check("and does not reach the site's search",
  !(await page.evaluate(() => window.harness.keysAtWindow)).includes("k"),
  (await page.evaluate(() => window.harness.keysAtWindow)).join("|"));

/* ============================================================
   11. WHAT THE PAGE IS HANDED
   ============================================================ */

await set("<p>Bold me.</p>");
await page.evaluate(() => {
  getSelection()!.selectAllChildren(document.querySelector("#editor p")!);
  window.harness.editor.command("bold");
});
await settle(200);
check("a formatting command goes straight through to the browser",
  /<(b|strong)>Bold me\.<\/(b|strong)>/.test(await html()), await html());
check("and whatever tag it chose arrives as the site's own",
  /<strong>Bold me\.<\/strong>/.test(await published()), await published());

await set("<p>Here: </p>");
await page.evaluate(() => {
  const paragraph = document.querySelector("#editor p")!;
  const range = document.createRange();
  range.selectNodeContents(paragraph);
  range.collapse(false);
  const selection = getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  window.harness.editor.insertHtmlAtCaret("<strong>inserted</strong>");
});
await settle(200);
check("markup can be inserted at the caret",
  /<strong>inserted<\/strong>/.test(await html()), await html());

await page.evaluate(() => { window.harness.editor.setHtml("<p>Set by the handle.</p>"); });
check("setHtml replaces the body", (await html()) === "<p>Set by the handle.</p>", await html());
check("html() answers with what is there",
  await page.evaluate(() => window.harness.editor.html()) === "<p>Set by the handle.</p>");
await page.evaluate(() => { window.harness.editor.clear(); });
check("clear() empties it", (await html()) === "", await html());

/* React unmounts, and the old Studio never did. Everything
   `createEditor` attaches has to come back off, or a component
   that goes away leaves a slash menu on the body and three
   listeners on the window. */
{
  await page.evaluate(() => { window.harness.editor.destroy(); });
  await settle(200);
  check("destroy() takes the slash menu off the page",
    (await page.locator(".slash-menu").count()) === 0);
  check("and the figure toolbar with it",
    (await page.locator(".fig-bar").count()) === 0);

  await seeded();
  const before = await page.evaluate(() => window.harness.changes);
  await page.keyboard.type("/note");
  await settle();
  check("and nothing it listened for still answers",
    (await page.locator(".slash-menu").count()) === 0);
  check("not even the change it reported on every keystroke",
    await page.evaluate(() => window.harness.changes) === before);

  await page.evaluate(() => { window.harness.mount(); });
  await seeded();
  await page.keyboard.type("## Mounted again");
  await settle();
  check("a second editor over the same surface works",
    /<h2>Mounted again<\/h2>/.test(await html()), await html());
}

/* ============================================================
   12. UNDER THE POLICY THE SITE ACTUALLY SHIPS

   A photo is read out of the editor by decoding, never by
   fetching: `fetch()` on a data: URL is governed by connect-src,
   not img-src, and this policy allows data: under img-src only.
   Every upload was blocked before it left the browser for weeks,
   silently, and the page looked identical.
   ============================================================ */

check("aab/_headers still allows data: photos under img-src",
  /img-src[^;]*\bdata:/.test(CSP), CSP);
check("and still does not allow fetching one",
  !/connect-src[^;]*\bdata:/.test(CSP), CSP);
check("so a pasted photo displays",
  await page.evaluate(async (src) => {
    const image = new Image();
    image.src = src;
    try { await image.decode(); } catch { return false; }
    return image.naturalWidth === 1;
  }, PIXEL));
check("and reading it back with fetch() is refused, which is why photo.js decodes",
  await page.evaluate(async (src) => {
    try { await fetch(src); return false; } catch { return true; }
  }, PIXEL));

/* ---------- done ---------- */

await context.close();
await browser.close();
server.close();

// The webfont host is the only outbound request the shell makes,
// and it is not what is under test here.
for (const err of pageErrors.filter((e) => !/fonts\.googleapis/.test(e))) {
  failures.push(`uncaught page error: ${err}`);
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}\n`);
  process.exit(1);
}
console.log("The writing surface still writes.\n");
