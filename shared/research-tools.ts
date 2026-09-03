/* ============================================================
   shared/research-tools.ts: the workshop's arithmetic. RESEARCH.md
   section 19.

   Thirty small tools are a form and an answer each, and every
   answer that can be a pure function is one here, so node holds
   it to a known value in scripts/research-tools.test.ts and the
   page only draws it: sample sizes, effect sizes, p and CI both
   ways, the which-test tree, dates including the tabular Islamic
   calendar, words in both scripts, abbreviations, readability as
   facts, a grid to four table syntaxes, Boolean strings in each
   database's syntax, a question from a frame, a card's memory for
   ts-fsrs, and a seeded random.
   ============================================================ */

import { normalCdf, normalInv } from "./research-stats.ts";
import type { Word } from "./research.ts";

/* ---------- sample size and power ---------- */

const zOf = (conf: number): number => normalInv(1 - (1 - conf) / 2);
const zAlpha = (alpha: number, twoSided = true): number => normalInv(1 - (twoSided ? alpha / 2 : alpha));
const zBeta = (power: number): number => normalInv(power);

/** A proportion within a margin at a confidence, with a design
    effect for clustered samples and a finite population where one
    is known. */
export function nProportion(p: number, margin: number, conf = 0.95, deff = 1, population: number | null = null): number {
  const z = zOf(conf);
  let n = (z * z * p * (1 - p)) / (margin * margin) * deff;
  if (population && population > 0) n = n / (1 + (n - 1) / population);
  return Math.ceil(n);
}

export const nMean = (sd: number, margin: number, conf = 0.95): number => Math.ceil(((zOf(conf) * sd) / margin) ** 2);

/** Two means: per group, Cohen's d, with the usual correction. */
export const nTwoMeans = (d: number, alpha = 0.05, power = 0.8): number => Math.ceil(2 * ((zAlpha(alpha) + zBeta(power)) / d) ** 2 + zAlpha(alpha) ** 2 / 4);

export function nTwoProportions(p1: number, p2: number, alpha = 0.05, power = 0.8): number {
  const pbar = (p1 + p2) / 2;
  const a = zAlpha(alpha) * Math.sqrt(2 * pbar * (1 - pbar)) + zBeta(power) * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  return Math.ceil((a / (p1 - p2)) ** 2);
}

/** A correlation, through Fisher's z. */
export const nCorrelation = (r: number, alpha = 0.05, power = 0.8): number => Math.ceil(((zAlpha(alpha) + zBeta(power)) / (0.5 * Math.log((1 + r) / (1 - r)))) ** 2 + 3);

/** A regression with `k` predictors and Cohen's f²: the normal
    approximation to the noncentral F, which is within a few
    observations of the exact answer for the sizes a thesis has. */
export const nRegression = (f2: number, k: number, alpha = 0.05, power = 0.8): number => Math.ceil((zAlpha(alpha) + zBeta(power)) ** 2 / f2 + k + 1);

/** The power of a two-group comparison of means at `n` a group. */
export const powerTwoMeans = (n: number, d: number, alpha = 0.05): number => 1 - normalCdf(zAlpha(alpha) - d * Math.sqrt(n / 2));

/* ---------- effect sizes ---------- */

export const dToR = (d: number): number => d / Math.sqrt(d * d + 4);
export const rToD = (r: number): number => (2 * r) / Math.sqrt(1 - r * r);
export const dToOR = (d: number): number => Math.exp((d * Math.PI) / Math.sqrt(3));
export const orToD = (or: number): number => (Math.log(or) * Math.sqrt(3)) / Math.PI;
export const eta2ToF = (eta2: number): number => Math.sqrt(eta2 / (1 - eta2));
export const fToEta2 = (f: number): number => (f * f) / (1 + f * f);
export const r2ToF2 = (r2: number): number => r2 / (1 - r2);

export function rInterval(r: number, n: number, conf = 0.95): [number, number] {
  const z = 0.5 * Math.log((1 + r) / (1 - r)), se = 1 / Math.sqrt(n - 3), q = zOf(conf);
  const back = (v: number): number => (Math.exp(2 * v) - 1) / (Math.exp(2 * v) + 1);
  return [back(z - q * se), back(z + q * se)];
}

export function dInterval(d: number, n1: number, n2: number, conf = 0.95): [number, number] {
  const se = Math.sqrt((n1 + n2) / (n1 * n2) + (d * d) / (2 * (n1 + n2)));
  return [d - zOf(conf) * se, d + zOf(conf) * se];
}

/* ---------- p and CI, both ways ---------- */

/** From an estimate and its interval to a p value, on the log
    scale for a ratio (an odds or hazard ratio). */
export function pFromInterval(est: number, lo: number, hi: number, conf = 0.95, ratio = false): { se: number; z: number; p: number } {
  const f = ratio ? Math.log : (v: number) => v;
  const se = (f(hi) - f(lo)) / (2 * zOf(conf));
  const z = f(est) / se;
  return { se, z, p: 2 * (1 - normalCdf(Math.abs(z))) };
}

export function intervalFromP(est: number, p: number, conf = 0.95, ratio = false): { se: number; lo: number; hi: number } {
  const z = normalInv(1 - p / 2);
  const f = ratio ? Math.log : (v: number) => v;
  const g = ratio ? Math.exp : (v: number) => v;
  const se = Math.abs(f(est)) / z;
  return { se, lo: g(f(est) - zOf(conf) * se), hi: g(f(est) + zOf(conf) * se) };
}

/* ---------- which test ---------- */

export interface Shape {
  outcome: "continuous" | "binary" | "categorical" | "count";
  groups: "one" | "two" | "many";
  paired: boolean;
  normal: boolean;
  predictors: "none" | "one" | "many";
  panel: boolean;
  endogenous: boolean;
}

export interface Advice { test: Word; method: string | null; why: Word }

/** A decision tree from the data's shape to a test, naming the
    lab's method where the lab has it. */
export function whichTest(s: Shape): Advice[] {
  const out: Advice[] = [];
  if (s.predictors !== "none") {
    if (s.endogenous) out.push({ test: { en: "Two-stage least squares", bn: "দুই-ধাপ ন্যূনতম বর্গ" }, method: "tsls", why: { en: "A regressor is chosen with the outcome, so an instrument has to stand in for it.", bn: "একটা ব্যাখ্যাকারী ফলাফলের সাথেই ঠিক হয়, তাই একটা উপকরণ তার জায়গা নেয়।" } });
    else if (s.panel && s.outcome === "continuous") out.push({ test: { en: "Panel fixed effects", bn: "প্যানেল স্থির প্রভাব" }, method: "panelfe", why: { en: "The same units over time: within-unit change, with errors clustered by unit.", bn: "একই একক সময় জুড়ে: এককের ভেতরের বদল, একক ধরে ক্লাস্টার করা ত্রুটি।" } });
    else if (s.outcome === "binary") out.push({ test: { en: "Logistic regression (or probit)", bn: "লজিস্টিক রিগ্রেশন (বা প্রোবিট)" }, method: "logit", why: { en: "A yes-or-no outcome on regressors.", bn: "হ্যাঁ-না ফলাফল, ব্যাখ্যাকারীর ওপর।" } });
    else if (s.outcome === "count") out.push({ test: { en: "Poisson or negative binomial (second tier)", bn: "পয়সোঁ বা নেগেটিভ বাইনোমিয়াল (দ্বিতীয় স্তর)" }, method: null, why: { en: "Counts are not normal and not bounded above; the lab's first tier does not fit these yet.", bn: "গণনা স্বাভাবিক নয়, ওপরে সীমাবদ্ধও নয়; ল্যাবের প্রথম স্তরে এখনো নেই।" } });
    else out.push({ test: { en: "OLS with robust standard errors", bn: "OLS, শক্ত মান ত্রুটিসহ" }, method: "ols", why: { en: "A continuous outcome on one or more regressors.", bn: "এক বা একাধিক ব্যাখ্যাকারীর ওপর ধারাবাহিক ফলাফল।" } });
    return out;
  }
  if (s.outcome === "categorical" || s.outcome === "binary") {
    if (s.groups === "one") out.push({ test: { en: "Chi-square goodness of fit, or a binomial test", bn: "কাই-বর্গ উপযুক্ততা, বা বাইনোমিয়াল পরীক্ষা" }, method: null, why: { en: "One sample's categories against expected shares.", bn: "এক নমুনার শ্রেণি, প্রত্যাশিত ভাগের বিপরীতে।" } });
    else out.push({ test: { en: "Chi-square test of independence", bn: "কাই-বর্গ স্বাধীনতা পরীক্ষা" }, method: "chisq", why: { en: "Two categorical variables in a table.", bn: "একটা ছকে দুটি শ্রেণিগত চলক।" } });
    return out;
  }
  if (s.groups === "one") out.push({ test: { en: "One-sample t test (or Wilcoxon signed rank)", bn: "এক-নমুনা t পরীক্ষা (বা উইলকক্সন)" }, method: null, why: { en: "One mean against a value.", bn: "একটা গড় একটা মানের বিপরীতে।" } });
  else if (s.groups === "two") {
    if (s.paired) out.push({ test: { en: s.normal ? "Paired t test" : "Wilcoxon signed rank", bn: s.normal ? "জোড়া t পরীক্ষা" : "উইলকক্সন সাইনড র‍্যাংক" }, method: s.normal ? "ttest" : null, why: { en: "The same units measured twice.", bn: "একই একক দুবার মাপা।" } });
    else out.push({ test: { en: s.normal ? "Welch's t test" : "Mann-Whitney U", bn: s.normal ? "Welch-এর t পরীক্ষা" : "Mann-Whitney U" }, method: s.normal ? "ttest" : "mannwhitney", why: { en: s.normal ? "Two independent groups; Welch does not assume equal variances." : "Two independent groups and no normality: ranks instead of means.", bn: s.normal ? "দুটি স্বাধীন দল; Welch সমান ভেদাঙ্ক ধরে না।" : "দুটি স্বাধীন দল, স্বাভাবিকতা নেই: গড়ের বদলে র‍্যাংক।" } });
  } else out.push({ test: { en: s.normal ? "One-way ANOVA" : "Kruskal-Wallis (second tier)", bn: s.normal ? "একমুখী ANOVA" : "Kruskal-Wallis (দ্বিতীয় স্তর)" }, method: s.normal ? "anova" : null, why: { en: "Three or more groups' means.", bn: "তিন বা ততোধিক দলের গড়।" } });
  return out;
}

/* ---------- dates ---------- */

const DAY = 86400000;
const utc = (iso: string): number => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
const iso = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

export const daysBetween = (a: string, b: string): number => Math.round((utc(b) - utc(a)) / DAY);

/** Working days from `a` up to and including `b`, with the
    weekend given as day numbers (0 Sunday): Friday and Saturday in
    Bangladesh, Saturday and Sunday in New Zealand. */
export function workingDays(a: string, b: string, weekend: number[] = [6, 0]): number {
  let n = 0;
  for (let t = utc(a); t <= utc(b); t += DAY) if (!weekend.includes(new Date(t).getUTCDay())) n += 1;
  return n;
}

export const shiftDays = (a: string, days: number): string => iso(utc(a) + days * DAY);

/** The tabular Islamic calendar (the civil, arithmetic one), which
    is within a day of the observed calendar and is said to be. */
export function toHijri(date: string): { y: number; m: number; d: number } {
  const jd = Math.floor(utc(date) / DAY) + 2440588;
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * l3) / 709);
  const d = l3 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;
  return { y, m, d };
}

export function fromHijri(y: number, m: number, d: number): string {
  const jd = Math.floor((11 * y + 3) / 30) + 354 * y + 30 * m - Math.floor((m - 1) / 2) + d + 1948440 - 385;
  return iso((jd - 2440588) * DAY);
}

export const HIJRI_MONTHS: Word[] = [
  { en: "Muharram", bn: "মুহররম" }, { en: "Safar", bn: "সফর" }, { en: "Rabi al-awwal", bn: "রবিউল আউয়াল" }, { en: "Rabi al-thani", bn: "রবিউস সানি" },
  { en: "Jumada al-ula", bn: "জমাদিউল আউয়াল" }, { en: "Jumada al-akhira", bn: "জমাদিউস সানি" }, { en: "Rajab", bn: "রজব" }, { en: "Sha'ban", bn: "শাবান" },
  { en: "Ramadan", bn: "রমজান" }, { en: "Shawwal", bn: "শাওয়াল" }, { en: "Dhu al-Qi'dah", bn: "জিলকদ" }, { en: "Dhu al-Hijjah", bn: "জিলহজ" },
];

/* ---------- words, abbreviations, readability ---------- */

const WORD = /[\p{L}\p{N}\p{M}\u09BC-\u09CD\u09D7]+(?:['’-][\p{L}\p{N}]+)*/gu;
const BANGLA = /[\u0980-\u09FF]/;

export interface WordStats { words: number; latin: number; bangla: number; characters: number; noSpaces: number; sentences: number; minutes: number }

/** Both scripts counted apart, because a Bangla reader reads
    fewer words a minute of a denser script: 200 a minute for
    Latin, 150 for Bangla. */
export function wordStats(text: string): WordStats {
  const words = text.match(WORD) ?? [];
  const bangla = words.filter((w) => BANGLA.test(w)).length;
  const latin = words.length - bangla;
  const sentences = (text.match(/[.!?।]+(\s|$)/g) ?? []).length || (text.trim() ? 1 : 0);
  return { words: words.length, latin, bangla, characters: text.length, noSpaces: text.replace(/\s/g, "").length, sentences, minutes: Math.max(1, Math.round(latin / 200 + bangla / 150)) };
}

export interface Abbreviation { abbr: string; definition: string | null; first: number; definedAt: number | null; usedBefore: boolean; uses: number }

/** Every run of two to six capitals, where it is first used, and
    whether "Full Name (ABBR)" defined it before that. */
export function abbreviations(text: string): Abbreviation[] {
  const out = new Map<string, Abbreviation>();
  for (const m of text.matchAll(/\b([A-Z][A-Z0-9]{1,5})\b/g)) {
    const a = m[1];
    const had = out.get(a);
    if (had) { had.uses += 1; continue; }
    out.set(a, { abbr: a, definition: null, first: m.index ?? 0, definedAt: null, usedBefore: false, uses: 1 });
  }
  for (const m of text.matchAll(/((?:[A-Z][\w-]*\s+){1,6}[A-Z][\w-]*)\s*\(([A-Z][A-Z0-9]{1,5})\)/g)) {
    const a = out.get(m[2]);
    if (!a) continue;
    a.definition = m[1].trim().replace(/^(The|A|An)\s+/, "");
    a.definedAt = m.index ?? 0;
    a.usedBefore = a.first < (m.index ?? 0);
  }
  return [...out.values()].sort((x, y) => x.first - y.first);
}

export interface Readability { sentences: number; words: number; meanSentence: number; longest: number; longWords: number; passive: number; passiveSentences: string[] }

const PASSIVE = /\b(am|is|are|was|were|be|been|being)\s+(\w+ed|\w+en|built|made|found|held|kept|shown|taken|given|known|seen|done|written|read|led|set|put|cut|hit|left|lost|met|paid|said|sold|sent|spent|told|thought|bought|brought|caught|taught|felt|dealt|meant|sought|fought|understood|withdrawn|drawn|grown|thrown|worn|torn|born|chosen|frozen|spoken|broken|stolen|woven|risen|driven|forgiven|hidden|ridden|bitten|beaten|eaten|fallen|forgotten|gotten|proven|sewn|shaken|shown|sown|swollen|undertaken|overcome|become|come|run)\b/gi;

/** Facts and no grade: sentence lengths, long words, and the
    sentences that read as passive. */
export function readability(text: string): Readability {
  const sentences = text.split(/(?<=[.!?।])\s+/).map((s) => s.trim()).filter(Boolean);
  const lengths = sentences.map((s) => (s.match(WORD) ?? []).length);
  const words = lengths.reduce((a, b) => a + b, 0);
  const longWords = (text.match(WORD) ?? []).filter((w) => w.length >= 12).length;
  const passiveSentences = sentences.filter((s) => PASSIVE.test(s) && (PASSIVE.lastIndex = 0) === 0);
  return { sentences: sentences.length, words, meanSentence: sentences.length ? words / sentences.length : 0, longest: Math.max(0, ...lengths), longWords, passive: passiveSentences.length, passiveSentences: passiveSentences.slice(0, 8) };
}

/* ---------- a grid to four syntaxes ---------- */

export function gridOf(text: string): string[][] {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim());
  const delim = lines[0]?.includes("\t") ? "\t" : lines[0]?.includes("|") ? "|" : ",";
  return lines.map((l) => l.split(delim).map((c) => c.trim())).map((r) => (delim === "|" ? r.filter((c, i, a) => !(c === "" && (i === 0 || i === a.length - 1))) : r)).filter((r) => !r.every((c) => /^-+$/.test(c)));
}

export const toMarkdown = (g: string[][]): string => {
  if (!g.length) return "";
  const [h, ...rows] = g;
  return [`| ${h.join(" | ")} |`, `| ${h.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
};
const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const toHtml = (g: string[][]): string => {
  if (!g.length) return "";
  const [h, ...rows] = g;
  return `<table>\n<thead><tr>${h.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>\n<tbody>\n${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("\n")}\n</tbody>\n</table>`;
};
const tex = (s: string): string => s.replace(/([&%$#_{}])/g, "\\$1");
export const toLatex = (g: string[][]): string => {
  if (!g.length) return "";
  const [h, ...rows] = g;
  return [`\\begin{tabular}{${h.map(() => "l").join("")}}`, "\\toprule", `${h.map(tex).join(" & ")} \\\\`, "\\midrule", ...rows.map((r) => `${r.map(tex).join(" & ")} \\\\`), "\\bottomrule", "\\end{tabular}"].join("\n");
};

/* ---------- Boolean strings, in each database's syntax ---------- */

export interface Clause { field: "all" | "title" | "abstract" | "keywords" | "author"; terms: string[]; op: "AND" | "OR" | "NOT" }
export type Syntax = "generic" | "pubmed" | "scopus" | "wos" | "openalex";

const FIELD: Record<Syntax, Record<Clause["field"], (t: string) => string>> = {
  generic: { all: (t) => t, title: (t) => `title:${t}`, abstract: (t) => `abstract:${t}`, keywords: (t) => `keyword:${t}`, author: (t) => `author:${t}` },
  pubmed: { all: (t) => `${t}[All Fields]`, title: (t) => `${t}[Title]`, abstract: (t) => `${t}[Title/Abstract]`, keywords: (t) => `${t}[MeSH Terms]`, author: (t) => `${t}[Author]` },
  scopus: { all: (t) => `ALL(${t})`, title: (t) => `TITLE(${t})`, abstract: (t) => `ABS(${t})`, keywords: (t) => `KEY(${t})`, author: (t) => `AUTH(${t})` },
  wos: { all: (t) => `TS=(${t})`, title: (t) => `TI=(${t})`, abstract: (t) => `AB=(${t})`, keywords: (t) => `AK=(${t})`, author: (t) => `AU=(${t})` },
  openalex: { all: (t) => t, title: (t) => `title.search:${t}`, abstract: (t) => `abstract.search:${t}`, keywords: (t) => `keywords.keyword:${t}`, author: (t) => `authorships.author.display_name.search:${t}` },
};

const quote = (t: string): string => (/\s/.test(t) ? `"${t}"` : t);

/** Each clause is its terms ORed inside one field, and the clauses
    joined by their operators in order. */
export function booleanString(clauses: Clause[], syntax: Syntax = "generic"): string {
  const parts = clauses.filter((c) => c.terms.length).map((c, i) => {
    const inner = c.terms.map((t) => FIELD[syntax][c.field](quote(t))).join(" OR ");
    const group = c.terms.length > 1 ? `(${inner})` : inner;
    return i === 0 ? (c.op === "NOT" ? `NOT ${group}` : group) : `${c.op} ${group}`;
  });
  return parts.join(" ");
}

/* ---------- a question from a frame ---------- */

export function questionFrom(frame: "pico" | "spider" | "peo", slots: Record<string, string>): { question: string; criteria: string[] } {
  const s = (k: string): string => (slots[k] ?? "").trim();
  if (frame === "pico") {
    return {
      question: `In ${s("population") || "[population]"}, does ${s("intervention") || "[intervention]"}${s("comparison") ? ` compared with ${s("comparison")}` : ""} affect ${s("outcome") || "[outcome]"}?`,
      criteria: [`Population: ${s("population")}`, `Intervention or exposure: ${s("intervention")}`, ...(s("comparison") ? [`Comparison: ${s("comparison")}`] : []), `Outcome: ${s("outcome")}`, "- Not empirical", "- No full text in a language the team reads"],
    };
  }
  if (frame === "spider") {
    return {
      question: `How do ${s("sample") || "[sample]"} experience ${s("phenomenon") || "[phenomenon of interest]"}, in ${s("design") || "[design]"} studies evaluated by ${s("evaluation") || "[evaluation]"}?`,
      criteria: [`Sample: ${s("sample")}`, `Phenomenon of interest: ${s("phenomenon")}`, `Design: ${s("design")}`, `Evaluation: ${s("evaluation")}`, `Research type: ${s("research") || "qualitative, quantitative or mixed"}`, "- Not primary research"],
    };
  }
  return {
    question: `Among ${s("population") || "[population]"}, how does ${s("exposure") || "[exposure]"} relate to ${s("outcome") || "[outcome]"}?`,
    criteria: [`Population: ${s("population")}`, `Exposure: ${s("exposure")}`, `Outcome: ${s("outcome")}`, "- Not about the exposure"],
  };
}

/* ---------- spaced repetition: the card, and its memory ---------- */

/** A card is the quiz note's own shape and its four scheduling
    fields are NOT renamed: `ease`, `interval`, `reps` and `due`
    are what SM-2 wrote into every card before 3 September 2026,
    they are still written after every review, and `due` stays a
    date so a build reading either shape draws the same card. The
    FSRS fields arrive with the first review under `ts-fsrs` and
    a card without them is read through `fromSm2`. */
export interface Card {
  id: string; front: string; back: string;
  ease: number; interval: number; reps: number; due: string;
  stability?: number; difficulty?: number; state?: number; lapses?: number; lastReview?: string;
}

export const newCard = (id: string, front: string, back: string, today: string): Card => ({ id, front, back, ease: 2.5, interval: 0, reps: 0, due: today });

/** What ts-fsrs reads and writes, spelled here so this file needs
    no import of it: node holds the mapping without the package
    and the page hands the object straight to `fsrs().next`. The
    states are the package's: 0 new, 1 learning, 2 review, 3
    relearning. */
export interface Memory {
  due: Date; stability: number; difficulty: number; elapsed_days: number; scheduled_days: number; learning_steps: number;
  reps: number; lapses: number; state: number; last_review?: Date;
}

const dateOf = (iso: string): Date => new Date(iso);
const dayOf = (d: Date): string => d.toISOString().slice(0, 10);

/** An SM-2 card as an FSRS memory. Stability is the interval at
    which recall is nine in ten, which is what an SM-2 interval
    was, so it carries over as it is. Difficulty runs 1 to 10 the
    other way from ease: 2.5 is 5, the floor of 1.3 is 10. A card
    never reviewed is new, whatever else it says. */
export function fromSm2(card: Card): Memory {
  if (card.reps === 0 || card.interval <= 0) return { due: dateOf(card.due), stability: 0, difficulty: 0, elapsed_days: 0, scheduled_days: 0, learning_steps: 0, reps: 0, lapses: 0, state: 0 };
  const difficulty = Math.min(10, Math.max(1, 5 + (2.5 - card.ease) * (5 / 1.2)));
  return {
    due: dateOf(card.due), stability: Math.max(0.1, card.interval), difficulty, elapsed_days: 0, scheduled_days: card.interval, learning_steps: 0,
    reps: card.reps, lapses: 0, state: 2, last_review: dateOf(shiftDays(card.due, -card.interval)),
  };
}

/** The memory a card carries, or the one its SM-2 fields imply. */
export const memoryOf = (card: Card): Memory => (card.stability !== undefined && card.difficulty !== undefined && card.state !== undefined
  ? { due: dateOf(card.due), stability: card.stability, difficulty: card.difficulty, elapsed_days: 0, scheduled_days: card.interval, learning_steps: 0, reps: card.reps, lapses: card.lapses ?? 0, state: card.state, last_review: card.lastReview ? dateOf(card.lastReview) : undefined }
  : fromSm2(card));

/** The scheduler's answer written back, with the SM-2 fields kept
    current so an older reader of the note still agrees on when. */
export function withMemory(card: Card, m: Memory): Card {
  return { ...card, due: dayOf(m.due), interval: m.scheduled_days, reps: m.reps, stability: m.stability, difficulty: m.difficulty, state: m.state, lapses: m.lapses, lastReview: m.last_review ? m.last_review.toISOString() : undefined };
}

/** The four buttons are still SM-2's grades, so the words and the
    ids on them stay; FSRS rates Again 1, Hard 2, Good 3, Easy 4. */
export const ratingOf = (grade: 0 | 1 | 2 | 3 | 4 | 5): 1 | 2 | 3 | 4 => (grade < 3 ? 1 : grade === 3 ? 2 : grade === 4 ? 3 : 4);

export const dueCards = (cards: Card[], today: string): Card[] => cards.filter((c) => c.due <= today).sort((a, b) => a.due.localeCompare(b.due));

/* ---------- random and sampling, with the seed shown ---------- */

/** mulberry32: small, fast, and the same numbers for the same
    seed on every machine, which is what makes a sample reportable. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randomInts = (seed: number, n: number, lo: number, hi: number): number[] => { const r = seeded(seed); return Array.from({ length: n }, () => lo + Math.floor(r() * (hi - lo + 1))); };

export function shuffle<T>(seed: number, items: T[]): T[] {
  const r = seeded(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

export const sample = <T>(seed: number, items: T[], k: number): T[] => shuffle(seed, items).slice(0, Math.max(0, Math.min(k, items.length)));

/* ---------- templates ---------- */

export interface Details { name: string; affiliation: string; email?: string; project: string; supervisor?: string; data?: string; storage?: string; retention?: string }

export function dataStatement(d: Details, lang: "en" | "bn"): string {
  return lang === "bn"
    ? `তথ্য বিবৃতি\n\nএই গবেষণা (${d.project}) ${d.data || "সাক্ষাৎকার ও জরিপের তথ্য"} সংগ্রহ করে। অংশগ্রহণকারীদের পরিচয় ছদ্মনামে রাখা হয়; নাম ও যোগাযোগ, রাখা হলে, গবেষকের পাসফ্রেজে এনক্রিপ্ট করা থাকে। তথ্য ${d.storage || "এনক্রিপ্ট করা স্টোরেজে"} রাখা হয় এবং ${d.retention || "গবেষণা শেষের পাঁচ বছর"} পর মুছে ফেলা হয়। বেনামি তথ্য প্রকাশনার সাথে ভাগ করা হতে পারে।\n\n${d.name}, ${d.affiliation}`
    : `Data statement\n\nThis study (${d.project}) collects ${d.data || "interview and survey data"}. Participants are identified by pseudonym; names and contact details, where kept, are encrypted under the researcher's passphrase. Data are stored ${d.storage || "in encrypted storage"} and destroyed ${d.retention || "five years after the study ends"}. Anonymised data may be shared with publications.\n\n${d.name}, ${d.affiliation}`;
}

export function consentForm(d: Details, lang: "en" | "bn"): string {
  return lang === "bn"
    ? `সম্মতিপত্র: ${d.project}\n\nগবেষক: ${d.name}, ${d.affiliation}${d.supervisor ? `\nতত্ত্বাবধায়ক: ${d.supervisor}` : ""}\n\nআমি বুঝেছি যে:\n- অংশগ্রহণ স্বেচ্ছায়, এবং কারণ না দেখিয়ে যেকোনো সময় সরে যেতে পারি।\n- আমার কথা রেকর্ড ও ট্রান্সক্রাইব করা হবে, এবং ছদ্মনামে রাখা হবে।\n- আমার উদ্ধৃতি প্রকাশনায় ব্যবহার হতে পারে: [ ] হ্যাঁ [ ] না\n- তথ্য ${d.retention || "গবেষণা শেষের পাঁচ বছর"} পর মুছে ফেলা হবে।\n\nনাম: ____________  স্বাক্ষর: ____________  তারিখ: ________`
    : `Consent form: ${d.project}\n\nResearcher: ${d.name}, ${d.affiliation}${d.supervisor ? `\nSupervisor: ${d.supervisor}` : ""}\n\nI understand that:\n- taking part is voluntary and I may withdraw at any time without giving a reason;\n- what I say will be recorded and transcribed, and kept under a pseudonym;\n- my words may be quoted in publications: [ ] yes [ ] no;\n- the data will be destroyed ${d.retention || "five years after the study ends"}.\n\nName: ____________  Signature: ____________  Date: ________`;
}

export const EMAILS: { id: string; name: Word; write: (d: Details, o: { to?: string; paper?: string; venue?: string }) => string }[] = [
  { id: "author", name: { en: "Ask an author for a paper", bn: "লেখকের কাছে কাগজ চাওয়া" }, write: (d, o) => `Dear ${o.to || "Dr ___"},\n\nI am a doctoral researcher at ${d.affiliation} working on ${d.project}. I have been unable to reach a copy of your paper "${o.paper || "___"}" through my library. Would you be willing to share a copy? It would be read for my own research only.\n\nWith thanks,\n${d.name}\n${d.affiliation}${d.email ? `\n${d.email}` : ""}` },
  { id: "supervisor", name: { en: "A note to a supervisor before a meeting", bn: "মিটিংয়ের আগে তত্ত্বাবধায়ককে নোট" }, write: (d, o) => `Dear ${o.to || d.supervisor || "___"},\n\nAhead of our meeting, three things:\n1. What I did this fortnight: ___\n2. Where I am stuck: ___\n3. What I would like your view on: ___\n\nThe current draft is attached. ${o.paper ? `The section to look at is ${o.paper}.` : ""}\n\nBest wishes,\n${d.name}` },
  { id: "cover", name: { en: "A cover letter to a journal", bn: "জার্নালে কভার লেটার" }, write: (d, o) => `Dear Editor,\n\nPlease consider the enclosed manuscript, "${o.paper || "___"}", for publication in ${o.venue || "___"}. It reports ___ and finds ___. The work is original, is not under consideration elsewhere, and all authors have approved the submission.\n\nYours faithfully,\n${d.name}\n${d.affiliation}${d.email ? `\n${d.email}` : ""}` },
];

export const VIVA: Word[] = [
  { en: "In one sentence, what is your thesis's contribution?", bn: "এক বাক্যে, আপনার থিসিসের অবদান কী?" },
  { en: "Why this question, and why now?", bn: "কেন এই প্রশ্ন, আর কেন এখন?" },
  { en: "What is the one paper your work most depends on, and what if it is wrong?", bn: "আপনার কাজ সবচেয়ে বেশি যে কাগজের ওপর দাঁড়িয়ে, সেটা ভুল হলে?" },
  { en: "Defend your identification strategy.", bn: "আপনার আইডেন্টিফিকেশন কৌশল রক্ষা করুন।" },
  { en: "What would change your mind about your main result?", bn: "মূল ফলাফল নিয়ে কী আপনার মত বদলাত?" },
  { en: "Why these data and not others?", bn: "কেন এই তথ্য, অন্য নয়?" },
  { en: "Which assumption are you least comfortable with?", bn: "কোন অনুমান নিয়ে আপনি সবচেয়ে কম স্বস্তিতে?" },
  { en: "How would a farmer in your study describe your finding?", bn: "আপনার গবেষণার একজন কৃষক আপনার ফলাফল কীভাবে বলতেন?" },
  { en: "What did you leave out, and why?", bn: "কী বাদ দিয়েছেন, কেন?" },
  { en: "What is the policy implication, stated carefully?", bn: "নীতিগত তাৎপর্য কী, সাবধানে বললে?" },
  { en: "Where does your work stop and speculation begin?", bn: "আপনার কাজ কোথায় থামে আর অনুমান কোথায় শুরু?" },
  { en: "What would you do differently with another year?", bn: "আরেক বছর পেলে কী ভিন্ন করতেন?" },
];

/** A CV section out of the library: the reader's own sources of
    type article, newest first, in a plain reference style. */
export function cvFrom(sources: { type: string; authors: string; year: number | null; title: string; csl: { "container-title"?: string; volume?: string; issue?: string; page?: string; DOI?: string } }[], name: string): string {
  const surname = name.trim().split(/\s+/).pop()?.toLowerCase() ?? "";
  const mine = sources.filter((s) => (s.type === "article" || s.type === "article-journal") && surname && s.authors.toLowerCase().includes(surname)).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  return mine.map((s) => `${s.authors} (${s.year ?? "n.d."}). ${s.title}. ${s.csl["container-title"] ?? ""}${s.csl.volume ? `, ${s.csl.volume}` : ""}${s.csl.issue ? `(${s.csl.issue})` : ""}${s.csl.page ? `, ${s.csl.page}` : ""}.${s.csl.DOI ? ` https://doi.org/${s.csl.DOI}` : ""}`).join("\n\n");
}

/* ---------- ids ---------- */

export type IdKind = "doi" | "arxiv" | "pmid" | "ssrn" | "openalex" | "isbn" | "orcid" | "url" | "unknown";

/** What an identifier is, from its shape alone. */
export function idKind(raw: string): { kind: IdKind; id: string } {
  const s = raw.trim();
  const doi = /10\.\d{4,9}\/\S+/.exec(s);
  if (doi) return { kind: "doi", id: doi[0].replace(/[.,;)]+$/, "") };
  const arxiv = /(?:arxiv:|arxiv\.org\/abs\/)?(\d{4}\.\d{4,5}(?:v\d+)?)/i.exec(s);
  if (arxiv && /arxiv|^\d{4}\.\d{4,5}/i.test(s)) return { kind: "arxiv", id: arxiv[1] };
  if (/^(pmid:?\s*)?\d{6,8}$/i.test(s)) return { kind: "pmid", id: s.replace(/\D/g, "") };
  if (/ssrn/i.test(s) || /^\d{7}$/.test(s)) { const m = /(\d{6,8})/.exec(s); if (m) return { kind: "ssrn", id: m[1] }; }
  if (/^W\d{6,}$/i.test(s) || /openalex\.org\/W\d+/i.test(s)) return { kind: "openalex", id: (/W\d+/i.exec(s) ?? [""])[0].toUpperCase() };
  if (/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(s)) return { kind: "orcid", id: s };
  if (/^(97[89])?\d{9}[\dX]$/.test(s.replace(/-/g, ""))) return { kind: "isbn", id: s.replace(/-/g, "") };
  if (/^https?:\/\//.test(s)) return { kind: "url", id: s };
  return { kind: "unknown", id: s };
}
