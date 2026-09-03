/* ============================================================
   scripts/research-tools.test.ts: the workshop's arithmetic held
   to the numbers a textbook gives.

     node scripts/research-tools.test.ts
   ============================================================ */

import {
  abbreviations, booleanString, daysBetween, dInterval, dToOR, dToR, dueCards, fromHijri, fromSm2, gridOf, idKind, intervalFromP, memoryOf, nCorrelation, nMean,
  nProportion, nRegression, nTwoMeans, newCard, orToD, pFromInterval, powerTwoMeans, questionFrom, rInterval, randomInts, ratingOf, readability, rToD, sample, shiftDays,
  toHijri, toLatex, toMarkdown, whichTest, withMemory, wordStats, workingDays,
} from "../shared/research-tools.ts";

let passed = 0;
const failures: string[] = [];
const ok = (name: string, cond: unknown, detail = ""): void => { if (cond) passed += 1; else failures.push(`${name}${detail ? `: ${detail}` : ""}`); };
const near = (a: number, b: number, places = 3): boolean => Math.abs(a - b) < 0.5 * 10 ** -places;

ok("a proportion at 50%, ±5%, 95% needs 385", nProportion(0.5, 0.05) === 385, String(nProportion(0.5, 0.05)));
ok("with a design effect of two, 769, and a population of 1000 brings it to 278 (the correction applied before rounding)", nProportion(0.5, 0.05, 0.95, 2) === 769 && nProportion(0.5, 0.05, 0.95, 1, 1000) === 278, `${nProportion(0.5, 0.05, 0.95, 2)} ${nProportion(0.5, 0.05, 0.95, 1, 1000)}`);
ok("a mean with sd 15 within 3 at 95% needs 97", nMean(15, 3) === 97, String(nMean(15, 3)));
ok("two means at d = 0.5, 80% power: 64 a group", nTwoMeans(0.5) === 64, String(nTwoMeans(0.5)));
ok("a correlation of 0.3 at 80% power needs 85", nCorrelation(0.3) === 85, String(nCorrelation(0.3)));
ok("a regression with f² 0.15 and 3 predictors needs about 57", nRegression(0.15, 3) >= 55 && nRegression(0.15, 3) <= 60, String(nRegression(0.15, 3)));
ok("power at 64 a group and d 0.5 is about 0.80", powerTwoMeans(64, 0.5) > 0.79 && powerTwoMeans(64, 0.5) < 0.82, powerTwoMeans(64, 0.5).toFixed(3));
ok("d 0.5 is r 0.243 and back", near(dToR(0.5), 0.2425) && near(rToD(dToR(0.5)), 0.5, 6), `${dToR(0.5)}`);
ok("d 0.5 is an odds ratio of 2.48 and back", near(dToOR(0.5), 2.476, 2) && near(orToD(dToOR(0.5)), 0.5, 6), `${dToOR(0.5)}`);
const ri = rInterval(0.3, 100);
ok("r 0.3 at n 100 has a 95% interval of about 0.11 to 0.47", near(ri[0], 0.110, 2) && near(ri[1], 0.468, 2), JSON.stringify(ri));
const di = dInterval(0.5, 50, 50);
ok("d 0.5 with 50 a group: about 0.10 to 0.90", near(di[0], 0.101, 2) && near(di[1], 0.899, 2), JSON.stringify(di));
const pi = pFromInterval(2, 1, 3);
ok("an estimate of 2 with interval 1 to 3 has se 0.51 and p about 0.0001", near(pi.se, 0.5102, 3) && pi.p < 0.0002, JSON.stringify(pi));
const ci = intervalFromP(0.8, 0.05, 0.95, true);
ok("a ratio of 0.8 at p 0.05 has an interval touching 1", near(ci.hi, 1, 3) && ci.lo < 0.8, JSON.stringify(ci));

ok("two normal independent groups: Welch, and the lab's t test", whichTest({ outcome: "continuous", groups: "two", paired: false, normal: true, predictors: "none", panel: false, endogenous: false })[0].method === "ttest");
ok("a binary outcome on regressors: logit", whichTest({ outcome: "binary", groups: "many", paired: false, normal: false, predictors: "many", panel: false, endogenous: false })[0].method === "logit");
ok("an endogenous regressor: 2SLS before anything else", whichTest({ outcome: "continuous", groups: "many", paired: false, normal: true, predictors: "many", panel: true, endogenous: true })[0].method === "tsls");
ok("two categorical variables: chi-square", whichTest({ outcome: "categorical", groups: "two", paired: false, normal: false, predictors: "none", panel: false, endogenous: false })[0].method === "chisq");

ok("days between and a shift", daysBetween("2026-09-01", "2026-09-30") === 29 && shiftDays("2026-09-30", -14) === "2026-09-16");
ok("working days with a Friday-Saturday weekend", workingDays("2026-09-01", "2026-09-07", [5, 6]) === 5 && workingDays("2026-09-01", "2026-09-07") === 5);
const h = toHijri("2025-06-27");
ok("1 Muharram 1447 is 27 June 2025 in the tabular calendar (a day after the sighted one), and back", h.y === 1447 && h.m === 1 && h.d === 1 && fromHijri(1447, 1, 1) === "2025-06-27" && toHijri("2025-06-26").m === 12, `${JSON.stringify(h)} ${fromHijri(1447, 1, 1)}`);
ok("and 1 Ramadan 1446 is 1 March 2025", fromHijri(1446, 9, 1) === "2025-03-01", fromHijri(1446, 9, 1));

const ws = wordStats("The bank said no. ব্যাংক না বলেছে। Twice.");
ok("words are counted in both scripts, sentences by either full stop", ws.words === 8 && ws.bangla === 3 && ws.latin === 5 && ws.sentences === 3, JSON.stringify(ws));
const ab = abbreviations("The World Bank (WB) lends. WB and the IMF differ; the International Monetary Fund (IMF) is later.");
ok("an abbreviation defined after its first use is flagged", ab.find((a) => a.abbr === "WB")?.definition === "World Bank" && !ab.find((a) => a.abbr === "WB")?.usedBefore && ab.find((a) => a.abbr === "IMF")?.usedBefore === true, JSON.stringify(ab));
const rd = readability("The crop was destroyed by the flood. Farmers borrowed. This sentence is rather longer than the others and it runs on.");
ok("readability is facts: three sentences, one passive, the longest counted", rd.sentences === 3 && rd.passive === 1 && rd.longest === 12, JSON.stringify(rd));

const g = gridOf("name,value\nrice,10\ndal,20");
ok("a grid to Markdown", toMarkdown(g) === "| name | value |\n| --- | --- |\n| rice | 10 |\n| dal | 20 |", toMarkdown(g));
ok("and to LaTeX with the specials escaped", toLatex(gridOf("a & b\tc%\n1\t2")).includes("a \\& b & c\\% \\\\"), toLatex(gridOf("a & b\tc%\n1\t2")));
ok("a pipe table with outer bars reads the same", gridOf("| a | b |\n| --- | --- |\n| 1 | 2 |").length === 2);

const bs = booleanString([{ field: "title", terms: ["weather index insurance", "crop insurance"], op: "AND" }, { field: "all", terms: ["Bangladesh"], op: "AND" }, { field: "all", terms: ["review"], op: "NOT" }], "scopus");
ok("a Boolean string in Scopus syntax", bs === '(TITLE("weather index insurance") OR TITLE("crop insurance")) AND ALL(Bangladesh) NOT ALL(review)', bs);
ok("and in PubMed's", booleanString([{ field: "abstract", terms: ["rainfall"], op: "AND" }], "pubmed") === "rainfall[Title/Abstract]");
const q = questionFrom("pico", { population: "smallholders in Bangladesh", intervention: "index insurance", outcome: "credit uptake" });
ok("a PICO frame becomes a question and criteria", q.question === "In smallholders in Bangladesh, does index insurance affect credit uptake?" && q.criteria.some((c) => c.startsWith("- ")), q.question);

const fresh = newCard("c1", "basis risk", "the gap between payout and loss", "2026-09-03");
ok("a card never reviewed is a new memory whatever its fields say", fromSm2(fresh).state === 0 && fromSm2({ ...fresh, ease: 1.3, interval: 6 }).state === 0);
const old = { ...fresh, ease: 2.5, interval: 15, reps: 3, due: "2026-09-25" };
const m = fromSm2(old);
ok("an SM-2 card's interval is its stability, 2.5 is difficulty 5, and it is in review since the day it was last seen", m.stability === 15 && m.difficulty === 5 && m.state === 2 && m.reps === 3 && m.last_review?.toISOString().slice(0, 10) === "2026-09-10", JSON.stringify(m));
ok("the ease floor of 1.3 is the hardest card and an easy 3.7 the easiest", fromSm2({ ...old, ease: 1.3 }).difficulty === 10 && fromSm2({ ...old, ease: 3.7 }).difficulty === 1, `${fromSm2({ ...old, ease: 1.3 }).difficulty} ${fromSm2({ ...old, ease: 3.7 }).difficulty}`);
const after = withMemory(old, { ...m, due: new Date("2026-10-20"), stability: 25.5, difficulty: 4.2, scheduled_days: 25, reps: 4, lapses: 0, state: 2, last_review: new Date("2026-09-25T09:00:00Z") });
ok("the scheduler's answer is written back on to the note's own fields, the due date a date", after.due === "2026-10-20" && after.interval === 25 && after.reps === 4 && after.stability === 25.5 && after.lastReview === "2026-09-25T09:00:00.000Z", JSON.stringify(after));
ok("and a card that carries a memory is read from it rather than from its ease", memoryOf(after).stability === 25.5 && memoryOf(after).difficulty === 4.2 && memoryOf(old).stability === 15);
ok("the four buttons map on to FSRS's four ratings", ratingOf(0) === 1 && ratingOf(2) === 1 && ratingOf(3) === 2 && ratingOf(4) === 3 && ratingOf(5) === 4);
const card = after;
ok("due cards are the ones at or before today", dueCards([card, newCard("c2", "a", "b", "2026-09-01")], "2026-09-01").length === 1);

ok("the same seed gives the same numbers", JSON.stringify(randomInts(7, 5, 1, 10)) === JSON.stringify(randomInts(7, 5, 1, 10)) && randomInts(7, 50, 1, 6).every((v) => v >= 1 && v <= 6));
ok("a sample is k of the rows, in a seeded order", sample(3, ["a", "b", "c", "d"], 2).length === 2 && JSON.stringify(sample(3, ["a", "b", "c", "d"], 4)) === JSON.stringify(sample(3, ["a", "b", "c", "d"], 4)));
ok("an id is known by its shape", idKind("https://doi.org/10.1016/j.jdeveco.2018.03.001").kind === "doi" && idKind("arXiv:2301.01234").kind === "arxiv" && idKind("W2741809807").kind === "openalex" && idKind("0000-0002-1825-0097").kind === "orcid" && idKind("978-0-14-303943-3").kind === "isbn" && idKind("32526271").kind === "pmid", JSON.stringify([idKind("arXiv:2301.01234"), idKind("32526271")]));

console.log(`research-tools: ${passed} checks passed${failures.length ? `, ${failures.length} failed` : ""}`);
for (const f of failures) console.log(`  x ${f}`);
if (failures.length) process.exit(1);
