/* ============================================================
   shared/research-assist.ts: the assistant's tasks, its grounding
   and its cost. RESEARCH.md section 21 and 36.

   The task list is what the drawer offers, because a blank prompt
   box is a tool nobody uses well: each task says what it needs,
   how hard the model should think, and the instruction. An answer
   cites the studio's own citation keys as [@key]; groundAnswer()
   splits the text at those marks and says which keys the library
   does not hold, so the page can strike them through. Cost is the
   usage times the model's published prices, kept on the note and
   summed on Settings, because a running cost is the one number
   that decides whether this stays on. Pure, and held by
   scripts/research-assist.test.ts.
   ============================================================ */

import type { Word } from "./research.ts";

export const CHUNK_KINDS = ["source", "note", "document", "highlight"] as const;
export type ChunkKind = typeof CHUNK_KINDS[number];

export const ASSISTANT_MODES = ["project", "fresh"] as const;
export type AssistantMode = typeof ASSISTANT_MODES[number];

export type Effort = "low" | "medium" | "high" | "xhigh";
export type Needs = "source" | "question" | "document" | "text" | "codebook" | "library" | "review" | "run";

export interface Task { id: string; name: Word; needs: Needs; effort: Effort; instruction: string }

/** The twelve of section 21, and a plain question. The instruction
    is the whole of what the model is told about the task; the
    system prompt below says how to cite and what never to do. */
export const TASKS: Task[] = [
  { id: "summarise", name: { en: "Summarise this source in five lines", bn: "এই উৎস পাঁচ লাইনে সারাংশ" }, needs: "source", effort: "medium", instruction: "Summarise the source below in five lines at most, each line one claim, with the page where the passages give one. Cite the source as [@key]." },
  { id: "extract", name: { en: "Pull out the method, sample, data and finding", bn: "পদ্ধতি, নমুনা, তথ্য ও ফলাফল বের করুন" }, needs: "source", effort: "medium", instruction: "From the source below, fill these fields as short phrases, one a line: Method; Sample; Data; Period; Finding; Effect size; Limitation. Write 'not stated' where the passages do not say." },
  { id: "highlights", name: { en: "What do my highlights on this source say, in order", bn: "এই উৎসে আমার হাইলাইটগুলো কী বলে, ক্রমে" }, needs: "source", effort: "low", instruction: "Read the highlights below in order and say in a paragraph what the reader marked and why it seems to matter, quoting no more than eight words at a time." },
  { id: "speak", name: { en: "Which of my sources speak to this question", bn: "কোন উৎসগুলো এই প্রশ্নে কথা বলে" }, needs: "question", effort: "medium", instruction: "For the question below, list which of the passages' sources speak to it and how: supports, contradicts, method or context, one line each, citing each as [@key]. Leave out sources that do not." },
  { id: "codes", name: { en: "Suggest codes for this segment from my codebook", bn: "আমার কোডবই থেকে এই অংশের কোড প্রস্তাব" }, needs: "codebook", effort: "low", instruction: "Given the codebook and the segment below, suggest which codes apply and why, one line a code, and say if none does. Never invent a code." },
  { id: "draft", name: { en: "Draft a paragraph on this question from these sources", bn: "এই উৎসগুলো থেকে এই প্রশ্নে একটি অনুচ্ছেদ" }, needs: "question", effort: "high", instruction: "Draft one paragraph answering the question below from the passages only, citing each claim as [@key]. Then, under the heading 'Unsupported', list any sentence you wanted to write and could not support from the passages." },
  { id: "examiner", name: { en: "Read this as an examiner would", bn: "একজন পরীক্ষকের মতো পড়ুন" }, needs: "document", effort: "xhigh", instruction: "Read the section below as a doctoral examiner. List the questions you would put to the candidate, hardest first, each in one sentence, and after each say what a satisfying answer would need to show." },
  { id: "strings", name: { en: "Turn this question into search strings", bn: "এই প্রশ্ন থেকে খোঁজার শব্দ" }, needs: "text", effort: "low", instruction: "Turn the search question below into search strings for OpenAlex, Scopus and Google Scholar, one each, with synonyms ORed and concepts ANDed." },
  { id: "translate", name: { en: "Translate this quotation and keep the original", bn: "এই উদ্ধৃতি অনুবাদ করুন, মূলটা রাখুন" }, needs: "text", effort: "low", instruction: "Translate the quotation below into English, faithfully and plainly. Give the original first, then the translation, then one line on any word that has no clean equivalent." },
  { id: "table", name: { en: "Explain this regression table in plain words", bn: "এই রিগ্রেশন টেবিল সহজ কথায়" }, needs: "run", effort: "medium", instruction: "Explain the regression table below in plain words for a reader who has not studied econometrics: what each coefficient means in the units of the data, which are distinguishable from zero, and what the table cannot say." },
  { id: "prisma", name: { en: "Write the PRISMA paragraph from these numbers", bn: "এই সংখ্যাগুলো থেকে PRISMA অনুচ্ছেদ" }, needs: "review", effort: "low", instruction: "Write the methods paragraph a PRISMA 2020 flow needs from the counts below: identified, duplicates removed, screened, excluded, sought, assessed, excluded with reasons, included. One paragraph, past tense." },
  { id: "tidy", name: { en: "Tidy this reference list against the library", bn: "লাইব্রেরির সাথে মিলিয়ে তথ্যসূত্র গোছান" }, needs: "text", effort: "medium", instruction: "Compare the reference list below with the library records given. For each reference say: matches [@key], differs from [@key] in (what), or not in the library. Never invent a record." },
  { id: "ask", name: { en: "Ask my library a question", bn: "আমার লাইব্রেরিকে প্রশ্ন" }, needs: "library", effort: "medium", instruction: "Answer the question below from the passages only, citing each claim as [@key]. If the passages do not answer it, say so in one line rather than answering from elsewhere." },
];

export const taskOf = (id: string): Task => TASKS.find((t) => t.id === id) ?? TASKS[TASKS.length - 1];

/** The whole of what the model is told about how to behave. */
export const SYSTEM = [
  "You are the assistant inside a doctoral researcher's own study, reading only what they hand you.",
  "Cite a source only as [@key] using a key that appears in the material given, and never name a paper, author or year that is not in that material: an answer that cites something the reader does not hold is worse than no answer.",
  "Write plainly, in the language the reader wrote in, and keep to what the passages support. Say 'not in the passages' rather than guessing.",
  "Do not browse, do not write into anything, and do not pad: the reader inserts what they choose.",
].join(" ");

/** The fresh mode's own footing: no brief, no rows, and the
    campaign's hostile reviewer. */
export const FRESH_SYSTEM = [
  "You are a hostile but fair reviewer reading a draft you have never seen, with no other context.",
  "Point at what is weak: claims without support, methods that do not answer the question, sentences that assert more than they show.",
  "Be specific, quote the words you mean, and never soften. Do not praise.",
].join(" ");

/* ---------- grounding ---------- */

export interface Piece { text: string; key?: string; known?: boolean }

/** The answer split at every [@key] mark, each mark saying whether
    the library holds that key, so the page can draw a chip or a
    strike-through with "not in your library" beside it. */
export function groundAnswer(answer: string, keys: Iterable<string>): { pieces: Piece[]; unknown: string[]; cited: string[] } {
  const have = new Set(keys);
  const pieces: Piece[] = [];
  const unknown = new Set<string>();
  const cited = new Set<string>();
  const re = /\[@([A-Za-z0-9_:.-]+)\]/g;
  let last = 0;
  for (const m of answer.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) pieces.push({ text: answer.slice(last, at) });
    const key = m[1];
    const known = have.has(key);
    pieces.push({ text: m[0], key, known });
    (known ? cited : unknown).add(key);
    last = at + m[0].length;
  }
  if (last < answer.length) pieces.push({ text: answer.slice(last) });
  return { pieces, unknown: [...unknown], cited: [...cited] };
}

/* ---------- chunks ---------- */

/** Text into chunks of about `size` characters at paragraph and
    sentence boundaries, with a little overlap so a sentence cut at
    the edge is whole in one of them. */
export function chunkText(text: string, size = 900): string[] {
  const paras = text.replace(/\r/g, "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  const push = (): void => { if (cur.trim()) out.push(cur.trim()); cur = ""; };
  for (const p of paras) {
    if ((cur + "\n\n" + p).length <= size) { cur = cur ? `${cur}\n\n${p}` : p; continue; }
    push();
    if (p.length <= size) { cur = p; continue; }
    const sentences = p.split(/(?<=[.!?।])\s+/);
    for (const s of sentences) {
      if ((cur + " " + s).length > size && cur) { out.push(cur.trim()); cur = s; }
      else cur = cur ? `${cur} ${s}` : s;
      while (cur.length > size * 1.5) { out.push(cur.slice(0, size)); cur = cur.slice(size - 80); }
    }
  }
  push();
  return out;
}

/* ---------- cost ---------- */

/** Published first-party prices, US dollars a million tokens. */
export const PRICES: Record<string, { input: number; output: number; cacheRead: number }> = {
  "claude-opus-5": { input: 5, output: 25, cacheRead: 0.5 },
  "claude-sonnet-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-haiku-4-5": { input: 1, output: 5, cacheRead: 0.1 },
};

export interface Usage { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number; cache_creation_input_tokens?: number }

export const costOf = (usage: Usage, model: string): number => {
  const p = PRICES[model] ?? PRICES["claude-opus-5"];
  const cached = usage.cache_read_input_tokens ?? 0;
  return ((usage.input_tokens - cached) * p.input + cached * p.cacheRead + (usage.cache_creation_input_tokens ?? 0) * p.input * 1.25 + usage.output_tokens * p.output) / 1e6;
};

/** Pounds from dollars at a rate the settings page states. */
export const GBP_PER_USD = 0.79;
export const gbp = (usd: number): number => Math.round(usd * GBP_PER_USD * 10000) / 10000;

/** Pounds as a string: pennies where there are any, four places
    under a penny, because one call costs a fraction of one. */
export const pounds = (usd: number): string => {
  const p = gbp(usd);
  return `£${p >= 0.01 || p === 0 ? p.toFixed(2) : p.toFixed(4)}`;
};

/* ---------- the prompt library ---------- */

/** `[PLACEHOLDER]` marks in a prompt note, in order, once each. */
export const placeholdersOf = (template: string): string[] => [...new Set([...template.matchAll(/\[([A-Z][A-Z0-9 _-]{1,40})\]/g)].map((m) => m[1]))];

export const fillPrompt = (template: string, values: Record<string, string>): string =>
  template.replace(/\[([A-Z][A-Z0-9 _-]{1,40})\]/g, (m, k: string) => (values[k]?.trim() ? values[k] : m));

/** The campaign's seven, shipped as templates. */
export const PROMPT_TEMPLATES: { title: Word; body: string }[] = [
  { title: { en: "Weekly review", bn: "সাপ্তাহিক পর্যালোচনা" }, body: "This week I read [SOURCES], wrote [WORDS] words and ran [RUNS]. Against the plan for [PROJECT], say what slipped, what to carry, and the one thing to do first on Monday." },
  { title: { en: "Argument check", bn: "যুক্তি যাচাই" }, body: "Here is my argument for [CHAPTER] in five claims: [CLAIMS]. For each, say what evidence I have cited, what an examiner would ask, and which claim is weakest." },
  { title: { en: "Method justification", bn: "পদ্ধতির যৌক্তিকতা" }, body: "I plan to use [METHOD] to answer [QUESTION] with [DATA]. List the assumptions the method makes, which my data can satisfy, and the nearest alternative I should mention and reject." },
  { title: { en: "Reviewer two", bn: "দ্বিতীয় রিভিউয়ার" }, body: "Read this abstract as the reviewer who rejects it: [ABSTRACT]. Give the three reasons in the reviewer's own voice." },
  { title: { en: "Plain summary", bn: "সরল সারাংশ" }, body: "Explain the finding [FINDING] to a farmer in [PLACE] in four sentences, in Bangla and in English, without the word 'significant'." },
  { title: { en: "Supervisor update", bn: "তত্ত্বাবধায়ককে আপডেট" }, body: "Turn these notes into a two-hundred-word update for my supervisor before our meeting on [DATE]: [NOTES]. Lead with what I need from them." },
  { title: { en: "Data statement draft", bn: "তথ্য বিবৃতির খসড়া" }, body: "Draft the data availability statement for [PAPER], where the data are [DATA] under [LICENCE], with the code at [CODE]." },
];
