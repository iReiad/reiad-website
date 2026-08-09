/* ============================================================
   notion.test.mjs — the Notion → HTML conversion.

     node functions/_lib/notion.test.mjs

   No token, no network, no Worker: `convert` is handed a fake
   client, and every block below is the shape Notion's API actually
   returns. What is being checked is that a page comes out as the
   small set of tags _lib/sanitise.js will let through, because
   anything else is silently deleted on the way into the database.
   ============================================================ */

import {
  convert, inline, normaliseId, propValue, readFields, textOf,
} from "./notion.js";
import { sanitiseHTML } from "./sanitise.js";

let passed = 0;
const failures = [];

function check(name, actual, expected) {
  const a = typeof actual === "string" ? actual : JSON.stringify(actual);
  const e = typeof expected === "string" ? expected : JSON.stringify(expected);
  if (a === e) { passed++; return; }
  failures.push(`${name}\n    expected: ${e}\n    actual:   ${a}`);
}

function ok(name, condition, detail = "") {
  if (condition) { passed++; return; }
  failures.push(`${name}${detail ? `\n    ${detail}` : ""}`);
}

/* ---------- helpers that build Notion's shapes ---------- */

const rt = (text, annotations = {}, href = null) => ({
  plain_text: text,
  annotations: { bold: false, italic: false, underline: false, code: false, ...annotations },
  href,
});

const block = (type, data, extra = {}) => ({
  id: `id-${type}`, type, [type]: data, has_children: false, ...extra,
});

/** A client that answers children lookups from a table, and counts
    its calls so the fetch budget can be checked. */
function fakeClient(childrenById = {}) {
  const calls = [];
  const fn = async (path) => {
    calls.push(path);
    const id = path.match(/\/blocks\/([^/]+)\/children/)?.[1];
    return { results: childrenById[id] ?? [], has_more: false, next_cursor: null };
  };
  fn.calls = calls;
  return fn;
}

const run = (blocks, childrenById = {}) => {
  const state = { fetches: 0, truncated: false };
  const notion = fakeClient(childrenById);
  return convert(blocks, { notion, origin: "https://reiad.co.uk", state })
    .then((html) => ({ html, state, notion }));
};

/* ============================================================
   1. Rich text
   ============================================================ */

check("plain text passes through", inline([rt("hello")]), "hello");

check("bold becomes strong",
  inline([rt("hello", { bold: true })]), "<strong>hello</strong>");

check("italic becomes em",
  inline([rt("hello", { italic: true })]), "<em>hello</em>");

// The site has no underline, because an underline on the web means a
// link. The Studio's paste sanitiser makes the same substitution.
check("underline becomes em",
  inline([rt("hello", { underline: true })]), "<em>hello</em>");

check("code wraps innermost",
  inline([rt("x", { code: true, bold: true })]), "<strong><code>x</code></strong>");

check("a link carries rel=noopener",
  inline([rt("site", {}, "https://example.com")]),
  '<a href="https://example.com" rel="noopener">site</a>');

// A javascript: href is the one that matters here.
check("an unsafe href is dropped, the text is kept",
  inline([rt("click", {}, "javascript:alert(1)")]), "click");

check("angle brackets in text are escaped",
  inline([rt("a < b & c")]), "a &lt; b &amp; c");

check("a quote in text is escaped",
  inline([rt('say "hi"')]), "say &quot;hi&quot;");

check("empty rich text is empty", inline([]), "");
check("a missing array is empty", inline(undefined), "");
check("textOf joins the parts", textOf([rt("a"), rt("b")]), "ab");

/* ============================================================
   2. Blocks
   ============================================================ */

{
  const { html } = await run([block("paragraph", { rich_text: [rt("Hello.")] })]);
  check("paragraph", html, "<p>Hello.</p>");
}

{
  const { html } = await run([block("paragraph", { rich_text: [] })]);
  check("an empty paragraph produces nothing", html, "");
}

{
  // Notion's heading_1 is the article's first in-body level, because
  // the page title is already the h1 on the rendered page.
  const { html } = await run([
    block("heading_1", { rich_text: [rt("One")] }),
    block("heading_2", { rich_text: [rt("Two")] }),
    block("heading_3", { rich_text: [rt("Three")] }),
  ]);
  check("headings shift down one level", html, "<h2>One</h2>\n<h2>Two</h2>\n<h3>Three</h3>");
}

{
  const { html } = await run([
    block("bulleted_list_item", { rich_text: [rt("a")] }),
    block("bulleted_list_item", { rich_text: [rt("b")] }),
  ]);
  check("consecutive bullets become one list", html, "<ul>\n<li>a</li>\n<li>b</li>\n</ul>");
}

{
  const { html } = await run([
    block("bulleted_list_item", { rich_text: [rt("a")] }),
    block("numbered_list_item", { rich_text: [rt("1")] }),
  ]);
  check("a different list kind closes the first",
    html, "<ul>\n<li>a</li>\n</ul>\n<ol>\n<li>1</li>\n</ol>");
}

{
  const { html } = await run([
    block("bulleted_list_item", { rich_text: [rt("a")] }),
    block("paragraph", { rich_text: [rt("after")] }),
    block("bulleted_list_item", { rich_text: [rt("b")] }),
  ]);
  check("a paragraph between bullets splits the list",
    html, "<ul>\n<li>a</li>\n</ul>\n<p>after</p>\n<ul>\n<li>b</li>\n</ul>");
}

{
  const { html } = await run([block("quote", { rich_text: [rt("said")] })]);
  check("quote", html, "<blockquote>said</blockquote>");
}

{
  // The site already styles `note`, and sanitise.js allows exactly
  // that class on a div, so a callout has somewhere to land.
  const { html } = await run([block("callout", { rich_text: [rt("Careful.")] })]);
  check("callout becomes the note box", html, '<div class="note">Careful.</div>');
}

{
  const { html } = await run([block("divider", {})]);
  check("divider", html, "<hr>");
}

{
  const { html } = await run([block("code", { rich_text: [rt("a < b")], language: "js" })]);
  check("code is escaped inside a code tag", html, "<p><code>a &lt; b</code></p>");
}

{
  const { html } = await run([
    block("to_do", { rich_text: [rt("done thing")], checked: true }),
    block("to_do", { rich_text: [rt("open thing")], checked: false }),
  ]);
  check("to_do items become a list marking the finished ones",
    html, "<ul>\n<li><strong>done</strong> done thing</li>\n<li>open thing</li>\n</ul>");
}

{
  const { html } = await run([block("bookmark", { url: "https://example.com", caption: [] })]);
  check("a bookmark becomes a link",
    html, '<p><a href="https://example.com" rel="noopener">https://example.com</a></p>');
}

{
  const { html } = await run([
    block("bookmark", { url: "https://example.com", caption: [rt("Example")] }),
  ]);
  check("a bookmark caption becomes the link text",
    html, '<p><a href="https://example.com" rel="noopener">Example</a></p>');
}

{
  const { html } = await run([block("unsupported", {})]);
  check("an unsupported block produces nothing", html, "");
}

{
  const { html } = await run([block("table_of_contents", {})]);
  check("a table of contents produces nothing", html, "");
}

/* ============================================================
   3. Images — the expiring-URL problem
   ============================================================ */

{
  const { html } = await run([
    block("image", {
      file: { url: "https://prod-files-secure.s3.us-west-2.amazonaws.com/x.png?sig=abc" },
      caption: [rt("A chart")],
    }),
  ]);

  ok("an image points at our own proxy, not at Notion",
    html.includes('src="https://reiad.co.uk/api/notion/asset?u='),
    html);
  ok("the signed URL is carried as an encoded parameter",
    html.includes(encodeURIComponent("https://prod-files-secure.s3.us-west-2.amazonaws.com/x.png?sig=abc")),
    html);
  ok("the caption becomes both the figcaption and the alt text",
    html.includes("<figcaption>A chart</figcaption>") && html.includes('alt="A chart"'),
    html);
}

{
  const { html } = await run([
    block("image", { external: { url: "https://example.com/x.png" }, caption: [] }),
  ]);
  ok("an external image is proxied too, and gets no empty figcaption",
    html.includes("/api/notion/asset?u=") && !html.includes("<figcaption>"),
    html);
}

{
  const { html } = await run([block("image", { caption: [] })]);
  check("an image with no URL at all produces nothing", html, "");
}

/* ============================================================
   4. Nesting and tables
   ============================================================ */

{
  const parent = block("bulleted_list_item", { rich_text: [rt("outer")] },
    { id: "p1", has_children: true });
  const { html } = await run([parent], {
    p1: [block("bulleted_list_item", { rich_text: [rt("inner")] })],
  });
  check("a nested list is fetched and nested",
    html, "<ul>\n<li>outer<ul>\n<li>inner</li>\n</ul></li>\n</ul>");
}

{
  const table = block("table", { has_column_header: true },
    { id: "t1", has_children: true });
  const row = (cells) => ({ type: "table_row", table_row: { cells } });
  const { html } = await run([table], {
    t1: [row([[rt("Year")], [rt("Return")]]), row([[rt("2024")], [rt("7%")]])],
  });
  check("a table keeps its header and gets the phone scroller",
    html,
    '<div class="table-scroll"><table><thead><tr><th>Year</th><th>Return</th></tr></thead>'
    + "<tbody><tr><td>2024</td><td>7%</td></tr></tbody></table></div>");
}

{
  const table = block("table", { has_column_header: false },
    { id: "t2", has_children: true });
  const { html } = await run([table], {
    t2: [{ type: "table_row", table_row: { cells: [[rt("a")]] } }],
  });
  ok("a table without a header row has no thead", !html.includes("<thead>"), html);
}

{
  // A column layout has no equivalent in a single-column article, so
  // it flattens to its contents rather than disappearing with them.
  const cols = block("column_list", {}, { id: "cl", has_children: true });
  const { html } = await run([cols], {
    cl: [block("column", {}, { id: "c1", has_children: true })],
    c1: [block("paragraph", { rich_text: [rt("in a column")] })],
  });
  check("columns flatten to their contents", html, "<p>in a column</p>");
}

{
  const toggle = block("toggle", { rich_text: [rt("Summary")] },
    { id: "tg", has_children: true });
  const { html } = await run([toggle], {
    tg: [block("paragraph", { rich_text: [rt("body")] })],
  });
  check("a toggle flattens, keeping its summary as a lead-in",
    html, "<p><strong>Summary</strong></p>\n<p>body</p>");
}

/* ============================================================
   5. The fetch budget

   Runaway recursion here would exhaust the Worker's subrequest
   allowance and return half an article without saying so.
   ============================================================ */

{
  // Each level says it has children, and the fake client always has
  // one more to give. Only the depth cap ends this.
  const deep = {};
  for (let i = 0; i < 12; i++) {
    deep[`n${i}`] = [block("bulleted_list_item", { rich_text: [rt(`level ${i + 1}`)] },
      { id: `n${i + 1}`, has_children: true })];
  }
  const root = block("bulleted_list_item", { rich_text: [rt("level 0")] },
    { id: "n0", has_children: true });

  const { html, notion } = await run([root], deep);
  ok("recursion stops at the depth cap rather than following forever",
    notion.calls.length <= 4, `made ${notion.calls.length} calls`);
  ok("the levels it did reach are all present",
    html.includes("level 0") && html.includes("level 3"), html);
}

{
  // Many siblings each wanting children is the other way to burn the
  // budget: breadth rather than depth.
  const kids = {};
  const wide = [];
  for (let i = 0; i < 40; i++) {
    wide.push(block("paragraph", { rich_text: [rt(`p${i}`)] },
      { id: `w${i}`, has_children: true }));
    kids[`w${i}`] = [block("paragraph", { rich_text: [rt(`child ${i}`)] })];
  }
  const { state, notion } = await run(wide, kids);
  ok("a wide page stops at the fetch cap", notion.calls.length <= 24,
    `made ${notion.calls.length} calls`);
  ok("and says it was truncated rather than looking complete", state.truncated === true);
}

/* ============================================================
   6. Properties
   ============================================================ */

{
  const props = {
    Name: { type: "title", title: [rt("The DSEX, explained")] },
    Standfirst: { type: "rich_text", rich_text: [rt("What it measures.")] },
    Category: { type: "select", select: { name: "Explainer" } },
    Topics: { type: "multi_select", multi_select: [{ name: "Equities" }, { name: "Beginner" }] },
    Published: { type: "date", date: { start: "2026-03-04" } },
    Language: { type: "select", select: { name: "Bangla" } },
    Slug: { type: "rich_text", rich_text: [rt("DSEX-Basics!")] },
  };
  const f = readFields(props);

  check("the title property is found whatever it is called", f.title, "The DSEX, explained");
  check("standfirst maps to dek", f.dek, "What it measures.");
  check("a select maps to tag", f.tag, "Explainer");
  check("a multi-select maps to topics", f.topics, ["Equities", "Beginner"]);
  check("a date is trimmed to the day", f.date, "2026-03-04");
  check("'Bangla' is recognised as bn", f.lang, "bn");
  check("a slug is lowercased and stripped to URL characters", f.slug, "dsex-basics");
}

{
  // A page loose in a workspace has nothing but a title, and must
  // still import rather than fail.
  const f = readFields({ title: { type: "title", title: [rt("Just a page")] } });
  check("a page with only a title still reads", f.title, "Just a page");
  check("a missing dek is empty, not undefined", f.dek, "");
  check("language defaults to English", f.lang, "en");
  check("topics defaults to an empty list", f.topics, []);
}

{
  const f = readFields({
    Name: { type: "title", title: [rt("x")] },
    tags: { type: "rich_text", rich_text: [rt("Equities, Beginner · Dhaka")] },
  });
  check("a text column of topics is split on commas and interpuncts",
    f.topics, ["Equities", "Beginner", "Dhaka"]);
}

check("a checkbox reads as a word", propValue({ type: "checkbox", checkbox: true }), "yes");
check("an unknown property type is empty", propValue({ type: "rollup" }), "");
check("a missing property is empty", propValue(undefined), "");

/* ---------- ids ---------- */

check("a bare 32-character id is dashed",
  normaliseId("1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"),
  "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d");
check("an id pasted out of a URL is found",
  normaliseId("https://notion.so/Some-Title-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"),
  "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d");
check("an already-dashed id survives",
  normaliseId("1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"),
  "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d");
check("something that isn't an id is rejected", normaliseId("hello"), null);
check("a too-short id is rejected", normaliseId("1a2b3c"), null);

/* ============================================================
   7. The whole point: does it survive the server sanitiser?

   Every one of these tags is dropped on the way into the database
   if the allowlist in sanitise.js doesn't know it, so converting to
   something pretty that gets deleted is the failure mode worth a
   test of its own.
   ============================================================ */

{
  const { html } = await run([
    block("heading_1", { rich_text: [rt("A heading")] }),
    block("paragraph", { rich_text: [rt("Text with "), rt("bold", { bold: true })] }),
    block("callout", { rich_text: [rt("A note")] }),
    block("quote", { rich_text: [rt("A quote")] }),
    block("divider", {}),
    block("bulleted_list_item", { rich_text: [rt("An item")] }),
    block("image", { external: { url: "https://example.com/x.png" }, caption: [rt("Cap")] }),
  ]);

  const cleaned = sanitiseHTML(html);

  for (const tag of ["<h2>", "<p>", "<strong>", "<blockquote>", "<hr>", "<ul>", "<li>", "<figure>", "<figcaption>"]) {
    ok(`the sanitiser keeps ${tag}`, cleaned.includes(tag), cleaned);
  }
  ok("the sanitiser keeps the note class on a callout",
    cleaned.includes('<div class="note">'), cleaned);
  ok("the sanitiser keeps the proxied image", cleaned.includes("<img"), cleaned);
  ok("nothing is lost wholesale", cleaned.length > html.length * 0.8,
    `${html.length} in, ${cleaned.length} out`);
}

{
  // Notion cannot produce this, but the converter must not be the
  // thing that would pass it on if it could.
  const { html } = await run([
    block("paragraph", { rich_text: [rt("<script>alert(1)</script>")] }),
  ]);
  ok("a script tag typed into Notion is escaped, not emitted",
    !html.includes("<script>") && html.includes("&lt;script&gt;"), html);
}

/* ============================================================ */

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} FAILED:\n`);
  for (const f of failures) console.log("  " + f + "\n");
  process.exit(1);
}
console.log("Notion conversion: all good.\n");
