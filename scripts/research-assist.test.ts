/* ============================================================
   scripts/research-assist.test.ts: the assistant's pure half.

   The grounding test the stage is held by: an answer naming a
   key the library does not hold comes back marked unknown, so the
   page can strike it through. Then the chunking the index runs
   on, the cost off a usage block against the published prices,
   and the prompt library's placeholders.

     node scripts/research-assist.test.ts
   ============================================================ */

import {
  ASSISTANT_MODES, CHUNK_KINDS, FRESH_SYSTEM, GBP_PER_USD, PRICES, PROMPT_TEMPLATES, SYSTEM, TASKS, chunkText, costOf, fillPrompt, gbp, groundAnswer, placeholdersOf, pounds, taskOf,
} from "../shared/research-assist.ts";

let passed = 0;
const failures: string[] = [];
const ok = (name: string, cond: unknown, detail = ""): void => { if (cond) passed += 1; else failures.push(`${name}${detail ? `: ${detail}` : ""}`); };
const near = (a: number, b: number, places = 6): boolean => Math.abs(a - b) < 0.5 * 10 ** -places;

/* ---- grounding ---- */
const g = groundAnswer("Rahman finds a fall [@rahman2021weather]. A paper nobody holds disagrees [@smith2020nothing], and [@rahman2021weather] again.", ["rahman2021weather", "ahmed2019bank"]);
ok("an answer splits at every [@key] mark", g.pieces.length === 7, String(g.pieces.length));
ok("a key the library holds is known", g.pieces[1].key === "rahman2021weather" && g.pieces[1].known === true);
ok("a key it does not hold is unknown, once, however often it is cited", g.unknown.join() === "smith2020nothing" && g.pieces[3].known === false);
ok("the cited list is the known keys, once each", g.cited.join() === "rahman2021weather");
ok("the text between marks is kept whole", g.pieces[0].text === "Rahman finds a fall " && g.pieces[6].text === " again.");
const plain = groundAnswer("Not in the passages.", ["x"]);
ok("an answer with no mark is one piece and nothing unknown", plain.pieces.length === 1 && plain.unknown.length === 0 && plain.cited.length === 0);
ok("a key may carry a dot, a colon or a hyphen", groundAnswer("[@doi:10.1/a-b.c]", ["doi:10.1/a-b.c"]).pieces[0].key === undefined && groundAnswer("[@a.b:c-d]", ["a.b:c-d"]).cited.join() === "a.b:c-d");
ok("an empty answer is no pieces", groundAnswer("", ["x"]).pieces.length === 0);

/* ---- chunks ---- */
ok("a short text is one chunk", chunkText("One paragraph.\n\nTwo.").length === 1);
const long = Array.from({ length: 12 }, (_, i) => `Paragraph ${i} says something of about a hundred characters so that twelve of them cannot fit in one chunk of nine hundred.`).join("\n\n");
const chunks = chunkText(long);
ok("a long text is cut at paragraph boundaries into chunks under the size", chunks.length >= 2 && chunks.every((c) => c.length <= 900), chunks.map((c) => c.length).join());
ok("and no paragraph is lost", chunks.join("\n\n").includes("Paragraph 11") && chunks.join("\n\n").includes("Paragraph 0"));
const bangla = chunkText(Array.from({ length: 30 }, (_, i) => `বাক্য ${i} এখানে শেষ হয়, আর এটা একটা মাঝারি দৈর্ঘ্যের বাক্য যাতে টুকরো করার নিয়মটা কাজ করে।`).join(" "), 400);
ok("one long paragraph is cut at sentence ends, the Bangla full stop included", bangla.length >= 3 && bangla.every((c) => /[।.!?]$/.test(c.trim())), bangla.map((c) => c.length).join());
const wall = chunkText("x".repeat(3000), 900);
ok("a wall of text with no boundary is still cut, with an overlap", wall.length >= 3 && wall.every((c) => c.length <= 900), wall.map((c) => c.length).join());

/* ---- cost ---- */
ok("prices are published for the three models", Object.keys(PRICES).length === 3 && PRICES["claude-opus-5"].output === 25);
const usd = costOf({ input_tokens: 1200, output_tokens: 42, cache_read_input_tokens: 300 }, "claude-opus-5");
ok("a call is priced from its usage, with cached input at the cache rate", near(usd, (900 * 5 + 300 * 0.5 + 42 * 25) / 1e6), String(usd));
ok("an unknown model is priced as the default rather than as nothing", costOf({ input_tokens: 1000, output_tokens: 0 }, "claude-x") === PRICES["claude-opus-5"].input / 1000);
ok("cache writes cost a quarter more", near(costOf({ input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 1000 }, "claude-opus-5"), 5 * 1.25 / 1000));
ok("pounds at the stated rate, to four places", gbp(1) === GBP_PER_USD && gbp(0.0057) === 0.0045 && GBP_PER_USD > 0.5 && GBP_PER_USD < 1);
ok("and written as pennies where there are any, four places under one, nought as nought", pounds(0.0057) === "£0.0045" && pounds(1) === "£0.79" && pounds(0) === "£0.00");

/* ---- the task list ---- */
ok("thirteen tasks, ids unique, both languages named", TASKS.length === 13 && new Set(TASKS.map((t) => t.id)).size === 13 && TASKS.every((t) => t.name.en && t.name.bn && t.instruction.length > 40));
ok("the examiner thinks hardest", taskOf("examiner").effort === "xhigh" && taskOf("codes").effort === "low");
ok("an unknown task falls back to asking the library", taskOf("nope").id === "ask");
ok("the system prompt says to cite only what is held, and the fresh one to praise nothing", SYSTEM.includes("[@key]") && SYSTEM.includes("never name") && FRESH_SYSTEM.includes("Do not praise"));
ok("two modes and four chunk kinds", ASSISTANT_MODES.join() === "project,fresh" && CHUNK_KINDS.join() === "source,note,document,highlight");

/* ---- the prompt library ---- */
const t = PROMPT_TEMPLATES[0];
ok("seven templates shipped, each with marks and both languages", PROMPT_TEMPLATES.length === 7 && PROMPT_TEMPLATES.every((p) => placeholdersOf(p.body).length > 0 && p.title.en && p.title.bn));
ok("placeholders in order, once each, uppercase only", placeholdersOf(t.body).join() === "SOURCES,WORDS,RUNS,PROJECT" && placeholdersOf("[a] [BB] [BB] [C-2]").join() === "BB,C-2");
const filled = fillPrompt(t.body, { PROJECT: "Drought thesis", WORDS: " " });
ok("a mark is filled where a value is given and left where it is blank", filled.includes("Drought thesis") && filled.includes("[WORDS]") && filled.includes("[SOURCES]"));

console.log(`research-assist: ${passed} passed, ${failures.length} failed`);
for (const f of failures) console.log(`  FAIL ${f}`);
process.exit(failures.length ? 1 : 0);
