/* ============================================================
   scripts/research-field.test.ts: the field room's arithmetic.
   RESEARCH.md section 15 calls it the coding test: segments out
   of a paste and out of the model, codings counted into the three
   matrices, and a survey's questions and answers as a table.

     node scripts/research-field.test.ts
   ============================================================ */

import {
  byParticipant, cleanAnswers, coOccurrence, matrixCsv, overInterviews, questionsOf, questionsText, responsesTable, secondsOf, segmentsFromModel, segmentsOf, stampOf, tokenOf,
} from "../shared/research-field.ts";

let passed = 0;
const failures: string[] = [];
const ok = (name: string, cond: unknown, detail = ""): void => { if (cond) passed += 1; else failures.push(`${name}${detail ? `: ${detail}` : ""}`); };

ok("a stamp reads hours, minutes and seconds", secondsOf("1:02:03") === 3723 && secondsOf("02:03") === 123 && secondsOf("12:34.5") === 754.5 && secondsOf("nonsense") === null);
ok("and writes them back", stampOf(3723) === "1:02:03" && stampOf(65) === "01:05");

const segs = segmentsOf("[00:12] P07: We lost the aman crop.\nthe whole of it.\n\n01:05 Interviewer: And the bank?\nP07: They said no.");
ok("a paste becomes segments at the times and speakers it names", segs.length === 3 && segs[0].start === 12 && segs[0].speaker === "P07" && segs[0].text === "We lost the aman crop. the whole of it." && segs[1].start === 65 && segs[1].speaker === "Interviewer", JSON.stringify(segs));
ok("an untimed segment after a timed one follows it, so the order holds on the player", segs[2].start === 66 && segs[1].end === 66 && segs[2].speaker === "P07", JSON.stringify(segs.map((s) => [s.start, s.end])));
const plain = segmentsOf("One.\n\nTwo.\n\nThree.", 90);
ok("with no times at all the segments are spaced over the duration", plain.length === 3 && plain[0].start === 0 && plain[1].start === 30 && plain[2].end === 90, JSON.stringify(plain));
ok("the model's own segments are taken as they are", segmentsFromModel({ text: "a b", segments: [{ start: 0.5, end: 2, text: " a " }, { start: 2, end: 3, text: "b" }] }).map((s) => s.text).join("|") === "a|b");
const vtt = segmentsFromModel({ vtt: "WEBVTT\n\n00:00.000 --> 00:02.500\nHello there\n\n00:02.500 --> 00:04.000\nAnd again" });
ok("and a VTT answer is read by its cues", vtt.length === 2 && vtt[0].end === 2.5 && vtt[1].text === "And again", JSON.stringify(vtt));

const codings = [
  { code_id: "c1", participant_id: "p1", source_id: "i1", note_id: "n1" },
  { code_id: "c1", participant_id: "p1", source_id: "i1", note_id: "n1" },
  { code_id: "c2", participant_id: "p1", source_id: "i1", note_id: "n1" },
  { code_id: "c1", participant_id: "p2", source_id: "i2", note_id: "n2" },
];
const bp = byParticipant(codings, ["c1", "c2"], ["p1", "p2"]);
ok("code by participant counts who said what", JSON.stringify(bp.cells) === "[[2,1],[1,0]]", JSON.stringify(bp.cells));
const co = coOccurrence(codings, ["c1", "c2"]);
ok("co-occurrence counts transcripts once, with the diagonal as presence", JSON.stringify(co.cells) === "[[2,1],[1,1]]", JSON.stringify(co.cells));
const ov = overInterviews(codings, ["c1", "c2"], ["i1", "i2"]);
ok("frequency over the interviews keeps their order", JSON.stringify(ov.cells) === "[[2,1],[1,0]]", JSON.stringify(ov.cells));
ok("a matrix is a CSV with the corner named", matrixCsv({ rows: ["a"], cols: ["x", "y"], cells: [[1, 2]] }, "code").startsWith('"code","x","y"\n"a",1,2'));

const qs = questionsOf("likert | I trust the bank* | আমি ব্যাংকে বিশ্বাস করি\nchoice | District | জেলা | Sylhet / সিলেট, Khulna\nnumber | Acres farmed\nnonsense | Free words");
ok("questions typed as lines get a type, both languages, options and a required mark", qs.length === 4 && qs[0].type === "likert" && qs[0].required && qs[0].en === "I trust the bank" && qs[1].options?.length === 2 && qs[1].options[0].bn === "সিলেট" && qs[1].options[1].bn === "Khulna" && qs[2].bn === "Acres farmed" && qs[3].type === "text", JSON.stringify(qs));
ok("and the lines come back out the same", questionsOf(questionsText(qs)).length === 4 && questionsText(qs).startsWith("likert | I trust the bank* | আমি"));
const a = cleanAnswers(qs, { q1: "4", q2: "Sylhet", q3: "12.5", q4: "x".repeat(3000), extra: "dropped" });
ok("a stranger's answers are checked against the questions", a.q1 === 4 && a.q2 === "Sylhet" && a.q3 === 12.5 && String(a.q4).length === 2000 && !("extra" in a), JSON.stringify(a).slice(0, 100));
const bad = cleanAnswers(qs, { q1: "9", q2: "Dhaka", q3: "many" });
ok("and a wrong answer is null rather than an error", bad.q1 === null && bad.q2 === null && bad.q3 === null && bad.q4 === null);
const t = responsesTable(qs, [{ answers: a, at: "2026-09-03T00:00:00Z" }]);
ok("responses are a table with one column a question", t.columns.join(",") === "submitted_at,q1,q2,q3,q4" && t.rows[0][1] === 4);
ok("a token is 22 hex characters of a UUID", /^[a-f0-9]{22}$/.test(tokenOf("6c575bc4-6e34-9145-ee63-698c081b2fa5")));

console.log(`research-field: ${passed} checks passed${failures.length ? `, ${failures.length} failed` : ""}`);
for (const f of failures) console.log(`  x ${f}`);
if (failures.length) process.exit(1);
