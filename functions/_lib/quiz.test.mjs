#!/usr/bin/env node
/* ============================================================
   quiz.test.mjs: a Coursera quiz export, turned into questions.

       node functions/_lib/quiz.test.mjs

   ---- why the fixture is written out rather than committed ----

   The real files are somebody else's course. Not one byte of the
   material is in this repository and that is the whole rule the
   section is built on, so the fixture below reproduces the SHAPE
   of an export with its own words in it: the same tags, the same
   nesting, the same stray whitespace inside a heading, the same
   trailing <style> and <script> that a saved page carries.

   Everything this parser can get wrong is a shape problem rather
   than a content problem, which is why that is enough.
   ============================================================ */

import { parseQuiz } from "./quiz.ts";
import { sanitiseHTML } from "./sanitise.ts";

let bad = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "  ok " : "FAIL"}  ${name}${cond ? "" : `\n        ${detail}`}`);
  if (!cond) bad += 1;
};

/* The export's own formatting, newlines inside the tags and all.
   A parser written against a tidied-up copy of this passes here
   and fails on the real thing. */
const QUIZ = `<meta charset="utf-8"/>
<h3>
 Question 1
</h3>
<co-content>
 <h2 level="2">
  <strong>
   Optional
  </strong>
  a heading the export puts inside the prompt
 </h2>
 <p>
  Some preamble before the question itself.
 </p>
 <img assetid="abc" src="data:image/png;base64,iVBORw0KGgo="/>
 <p>
  Which of the following does this involve?
 </p>
</co-content>
<form>
 <label>
  <input name="0" type="radio"/>
  <co-content>
   <span>
    The first option
   </span>
  </co-content>
  <br/>
 </label>
 <label>
  <input name="0" type="radio"/>
  <co-content>
   <span>
    The second option, which has a comma in it
   </span>
  </co-content>
  <br/>
 </label>
</form>
<hr/>
<h3>
 Question 2
</h3>
<co-content>
 <p>
  Fill in the blank: this one is _____. Select all that apply.
 </p>
</co-content>
<form>
 <label>
  <input name="1" type="checkbox"/>
  <co-content>
   <span>
    measures numerical facts
   </span>
  </co-content>
  <br/>
 </label>
 <label>
  <input name="1" type="checkbox"/>
  <co-content>
   <span>
    is specific &amp; short
   </span>
  </co-content>
  <br/>
 </label>
</form>
<hr/>
<style>
 body { padding: 50px 85px; }
</style>
<script async="" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js" type="text/javascript">
</script>
`;

/* ============================================================ */

console.log("\n--- the questions come out ---");

const qs = parseQuiz(QUIZ);

ok("both questions are found", qs.length === 2, `got ${qs.length}`);
ok("numbered as the export prints them, not counted",
  qs[0]?.n === 1 && qs[1]?.n === 2, JSON.stringify(qs.map((q) => q.n)));

console.log("\n--- the options, which are the whole point ---");

/* This is the check the feature exists for. `sanitiseHTML` drops
   `<form>` whole, contents and all, so running it over a quiz
   deletes every answer and leaves the questions standing. The
   page looked finished and was missing the half a reader came
   for. */
const sanitised = sanitiseHTML(QUIZ);
ok("sanitiseHTML alone really does lose them",
  !sanitised.includes("The first option"),
  "if this ever fails, the sanitiser changed and this parser may not be needed");
ok("the parser keeps them", qs[0]?.options.length === 2,
  JSON.stringify(qs[0]?.options));
ok("with their text intact",
  qs[0]?.options[0] === "The first option", qs[0]?.options[0]);
ok("whitespace collapsed rather than carried",
  qs[0]?.options[1] === "The second option, which has a comma in it",
  JSON.stringify(qs[0]?.options[1]));
ok("and entities decoded",
  qs[1]?.options[1] === "is specific & short", qs[1]?.options[1]);

console.log("\n--- pick one against select all ---");

ok("a radio question is single choice", qs[0]?.multiple === false);
ok("a checkbox question is not", qs[1]?.multiple === true,
  "offering radios for a select-all question tells the reader the wrong thing");

console.log("\n--- the prompt ---");

ok("the question's own words survive",
  qs[0]?.prompt.includes("Which of the following does this involve?"));
ok("so does the preamble above it",
  qs[0]?.prompt.includes("Some preamble"));
ok("headings inside a prompt are kept",
  /<h2\b/.test(qs[0]?.prompt ?? ""), qs[0]?.prompt.slice(0, 80));
ok("a diagram survives as a data URI",
  /<img[^>]+src="data:image\/png/.test(qs[0]?.prompt ?? ""));
ok("the prompt is sanitised: no custom elements",
  !/<co-content/i.test(qs[0]?.prompt ?? ""));
ok("and the options are not repeated inside it",
  !qs[0]?.prompt.includes("The first option"),
  "the prompt is everything BEFORE the form");

console.log("\n--- what a saved page drags along ---");

const all = qs.map((q) => q.prompt).join("");
ok("no stylesheet", !/<style/i.test(all));
ok("no script", !/<script/i.test(all) && !all.includes("MathJax"));
ok("no stray input", !/<input/i.test(all));

console.log("\n--- and what is not a quiz ---");

ok("a reading parses to nothing, rather than to one empty question",
  parseQuiz("<h1>A reading</h1><p>Some words.</p>").length === 0,
  "the caller falls back to rendering it as a page");
ok("so does an empty file", parseQuiz("").length === 0);
ok("and so does rubbish", parseQuiz("not html at all").length === 0);

/* A heading with nothing under it is a fragment of a broken
   export. It must not become a question with no options, because
   that draws a numbered box with nothing in it. */
ok("a bare heading is not a question",
  parseQuiz("<h3>\n Question 1\n</h3>\n").length === 0);

console.log("\n--- no answer key, and none invented ---");

/* Worth asserting as a fact about the DATA rather than about the
   code: the day an export arrives with the answers in it, this
   fails and somebody goes and reads why. */
ok("the export marks nothing as correct",
  !/\bchecked\b/i.test(QUIZ) && !/\bcorrect\b/i.test(QUIZ));
ok("and the parsed question carries no notion of one",
  qs.every((q) => !("correct" in q) && !("answer" in q)),
  Object.keys(qs[0] ?? {}).join(", "));

/* ============================================================ */

console.log(bad ? `\n${bad} check(s) failed.\n` : "\nAll checks passed.\n");
process.exit(bad ? 1 : 0);
