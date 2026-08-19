/* ============================================================
   comments.test.ts: the thread under a piece, as markup.

     node next/comments.test.ts

   `aab/comments.js` was 219 lines of `document.createElement` and
   it is `components/comments.tsx` now. A port is finished when it
   does what the thing it replaced did, not when it renders, so
   what that module did is written down here.

   ---- what it can and cannot ask ----

   This renders the components and reads the markup. The effects
   do not run, which is the honest limit: what a fetch of
   `/api/comments` puts on the page, and what pressing Post does,
   are not asked here and are not asked anywhere yet, because
   nothing in this repository drives a DYNAMIC route in a browser.
   `interactive.test.mjs` serves Next's prerendered files and an
   article is not one.

   So the split is deliberate rather than convenient:

     `CommentCard`   is pure, takes a comment, and every state it
                     has is reachable from a prop. Asked in full.
     `Comments`      is asked for its FIRST paint, which is the
                     one React hydrates against and the one a
                     reader with no JavaScript keeps.

   The most important check in the file is the escaping one. It is
   the guarantee the module opened with, in capitals: a body is
   text on the way in, text in the column, and text on the way
   out, and every injection this site has had came from parsing
   something.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..");

let esbuild;
try {
  ({ build: esbuild } = await import("esbuild"));
} catch {
  console.log("esbuild is not installed, so the comments check is skipped.");
  console.log("  cd next && npm install");
  process.exit(0);
}

/* Bundled with the renderer, because the result is imported as a
   `data:` URL and a data module cannot resolve a bare specifier.
   `aab/schools/workbook.test.mjs` says the rest, including why
   this reaches for the component and never for the page. */
const bundled = await esbuild({
  stdin: {
    contents: `export { Comments, CommentCard } from "./components/comments";
               export { renderToStaticMarkup } from "react-dom/server.browser";`,
    resolveDir: here,
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  mainFields: ["module", "main"],
  conditions: ["import", "default"],
  jsx: "automatic",
  logLevel: "silent",
});

const { Comments, CommentCard, renderToStaticMarkup: render } = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);

const { createElement: h } = await import("react");

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed += 1; return; }
  failures.push(detail ? `${name}\n      ${detail}` : name);
};

console.log("the thread under a piece");

/* ---------- one comment ---------- */

{
  const html = render(h(CommentCard, {
    comment: {
      id: 1,
      author_name: "Ayesha Rahman",
      body: "This helped, thank you.",
      created_at: new Date().toISOString(),
    },
  }));

  ok("a comment is an <li class=comment>", /^<li class="comment">/.test(html), html.slice(0, 60));
  ok("with the writer's name", html.includes("<strong>Ayesha Rahman</strong>"));
  ok("and the initial in the little circle",
    html.includes('<span class="comment-mark">A</span>'));
  ok("and the body, under its own class",
    html.includes('<p class="comment-body">This helped, thank you.</p>'));
  ok("and how long ago, which is the only date a reader sees",
    /class="mono comment-when">today</.test(html), html);
  ok("no Reply button when nothing can be replied to",
    !html.includes("comment-reply"));
}

/* ---------- somebody with no name, which the endpoint allows ---------- */

{
  const html = render(h(CommentCard, { comment: { id: 2, author_name: "", body: "hm" } }));
  ok('an unnamed writer is "Reader"', html.includes("<strong>Reader</strong>"));
  ok("and the circle says ?", html.includes('<span class="comment-mark">?</span>'));
  ok("an unparseable date prints nothing rather than Invalid Date",
    /class="mono comment-when"><\/span>/.test(html), html);
}

/* ---------- THE ONE THAT MATTERS: a body is text ---------- */

{
  const nasty = `<script>alert('x')</script> & <b>bold</b> "quoted"`;
  const html = render(h(CommentCard, { comment: { id: 3, author_name: "R", body: nasty } }));

  ok("a body containing markup does not become markup",
    !html.includes("<script>") && !html.includes("<b>"), html);
  ok("the angle brackets are escaped",
    html.includes("&lt;script&gt;") && html.includes("&lt;b&gt;"), html);
  ok("and the ampersand", html.includes("&amp;"), html);
  ok("and the whole of it is still readable as the words it was",
    html.includes("alert(") && html.includes("bold"), html);
}

/* ---------- replies, one level and no further ---------- */

{
  const html = render(h(CommentCard, {
    comment: {
      id: 4, author_name: "R", body: "top",
      replies: [{ id: 5, author_name: "S", body: "under" }],
    },
    onReply: () => {},
  }));

  ok("a comment with replies carries a <ul class=comment-replies>",
    html.includes('<ul class="comment-replies">'));
  ok("and the reply is inside it", html.includes('<p class="comment-body">under</p>'));
  /* The endpoint refuses a second level with `replies-are-one-level`,
     and `scripts/schools-api.test.ts`'s sibling `comments.test.ts`
     asserts that. Not drawing the button is how a reader finds out
     without being refused. */
  ok("a reply offers no Reply of its own, because the endpoint refuses one",
    html.match(/comment-reply/g)?.length === 1, html.match(/comment-reply/g)?.join(","));
}

/* ---------- the thread's first paint ---------- */

{
  const html = render(h(Comments, { slug: "dse-basics", section: "insights" }));

  ok("the thread names itself", html.includes('<h2 class="comment-title">Comments</h2>'));
  ok("the list is there and empty, so hydration has the same shape",
    /<ul class="comment-list"><\/ul>/.test(html), html);
  /* Signed out is the state the SERVER renders, always: it has no
     session and cannot have one. So this is the markup React
     hydrates against and the markup a reader with no JavaScript
     keeps, and both have to be the signed-out one. */
  ok("signed out is what the server draws",
    html.includes('<p class="comment-invite">'), html);
  ok("with a way in", html.includes(">Sign in</button>"));
  ok("and the line that says the thread is readable without an account",
    html.includes("readable without an account"));
  ok("no box to write in until somebody is signed in",
    !html.includes("comment-form") && !html.includes("comment-box"));
  ok("and no note, because nothing has happened yet",
    !html.includes("comment-note"));
}

/* ---------- the guarantee, read off the source ---------- */

{
  /* COMMENTS STRIPPED FIRST, and that is not tidiness: the
     component's own header names the escape hatch in order to say
     it is the way to lose the guarantee, so a check reading the
     raw file fails on the sentence explaining why it must not.
     It did, the first time this ran. */
  const src = readFileSync(join(here, "components", "comments.tsx"), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
  /* The one way to lose the escaping above is to reach for that
     hatch. Asserted against the source rather than the markup,
     because the markup can only show what today's props produce
     and this shows that there is no path at all. */
  ok("nothing in the component sets HTML by hand",
    !src.includes("dangerouslySetInnerHTML"),
    "a body would stop being text the moment one appeared");
  ok("and it does not reach for innerHTML either",
    !/\binnerHTML\b/.test(src));
}

/* ---------- and the module it replaced is gone ---------- */

{
  const { existsSync } = await import("node:fs");
  ok("aab/comments.js is not served any more",
    !existsSync(join(ROOT, "aab", "comments.js")),
    "two implementations of one thread is the copy CLAUDE.md refuses");
  ok("and it is readable in archive/, which is where a replaced file goes",
    existsSync(join(ROOT, "archive", "modules", "comments.js")));
  ok("nothing precaches it",
    !readFileSync(join(ROOT, "aab", "sw.js"), "utf8").includes('"/comments.js"'),
    "an install would fetch a 404 and cache it");
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
console.log("A comment is text, a reply is one level deep, and the thread\n"
  + "draws itself signed out before anybody asks.\n");
/* esbuild keeps a child process alive, so node would sit here with
   nothing to do rather than exiting. Every test that bundles ends
   this way; the first run of this one only exited because it
   failed, which is a cheerful way to hide a hang. */
process.exit(0);
