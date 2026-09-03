/* ============================================================
   shared/research-review.ts: the review room's vocabulary and
   arithmetic. RESEARCH.md section 13.

   The stages a record passes through, the frames a question is
   put in, the appraisal templates, and PRISMA 2020 derived from
   the rows: the flow diagram's boxes are counts by stage and by
   reason, so changing a decision changes the diagram. Pure, held
   by scripts/research.test.ts.
   ============================================================ */

import type { Word } from "./research.ts";

export const REVIEW_KINDS = ["systematic", "scoping", "narrative"] as const;
export type ReviewKind = typeof REVIEW_KINDS[number];

export const REVIEW_KIND_NAMES: Record<ReviewKind, Word> = {
  systematic: { en: "Systematic review", bn: "পদ্ধতিগত পর্যালোচনা" },
  scoping: { en: "Scoping review", bn: "পরিধি পর্যালোচনা" },
  narrative: { en: "Narrative review", bn: "বর্ণনামূলক পর্যালোচনা" },
};

export const REVIEW_STATES = ["protocol", "searching", "screening", "extracting", "synthesis", "done"] as const;
export type ReviewState = typeof REVIEW_STATES[number];

export const REVIEW_STATE_NAMES: Record<ReviewState, Word> = {
  protocol: { en: "Protocol", bn: "প্রোটোকল" },
  searching: { en: "Searching", bn: "খোঁজা হচ্ছে" },
  screening: { en: "Screening", bn: "যাচাই" },
  extracting: { en: "Extracting", bn: "নিষ্কাশন" },
  synthesis: { en: "Synthesis", bn: "সংশ্লেষ" },
  done: { en: "Done", bn: "শেষ" },
};

export const RECORD_STAGES = ["found", "deduplicated", "title", "fulltext", "included", "excluded"] as const;
export type RecordStage = typeof RECORD_STAGES[number];

export const STAGE_NAMES: Record<RecordStage, Word> = {
  found: { en: "Found", bn: "পাওয়া" },
  deduplicated: { en: "Duplicate", bn: "দ্বিত্ব" },
  title: { en: "Title and abstract", bn: "শিরোনাম ও সারাংশ" },
  fulltext: { en: "Full text", bn: "পূর্ণ লেখা" },
  included: { en: "Included", bn: "অন্তর্ভুক্ত" },
  excluded: { en: "Excluded", bn: "বাদ" },
};

export const FRAMES = ["pico", "spider", "plain"] as const;
export type Frame = typeof FRAMES[number];

/** The slots each frame asks for; a plain frame is one question. */
export const FRAME_SLOTS: Record<Frame, { id: string; en: string; bn: string }[]> = {
  pico: [
    { id: "population", en: "Population", bn: "জনগোষ্ঠী" }, { id: "intervention", en: "Intervention", bn: "হস্তক্ষেপ" },
    { id: "comparison", en: "Comparison", bn: "তুলনা" }, { id: "outcome", en: "Outcome", bn: "ফলাফল" },
  ],
  spider: [
    { id: "sample", en: "Sample", bn: "নমুনা" }, { id: "phenomenon", en: "Phenomenon of interest", bn: "আগ্রহের বিষয়" },
    { id: "design", en: "Design", bn: "নকশা" }, { id: "evaluation", en: "Evaluation", bn: "মূল্যায়ন" }, { id: "research", en: "Research type", bn: "গবেষণার ধরন" },
  ],
  plain: [{ id: "question", en: "The question", bn: "প্রশ্ন" }],
};

export interface Criterion { id: string; kind: "include" | "exclude"; text: string }

export interface Protocol {
  frame?: Frame;
  question?: Record<string, string>;
  criteria?: Criterion[];
  databases?: string[];
  from?: number;
  to?: number;
  languages?: string[];
  screeners?: string[];
  /** The extraction sheet's columns, the reader's own. */
  columns?: string[];
  /** Which appraisal template. */
  appraisal?: string;
}

/** The appraisal templates: a checklist per included source, the
    score derived from the answers. Data, so the reader can add
    one by pasting questions. */
export const APPRAISALS: Record<string, { name: string; questions: string[] }> = {
  casp: {
    name: "CASP (qualitative)",
    questions: [
      "Was there a clear statement of the aims of the research?", "Is a qualitative methodology appropriate?",
      "Was the research design appropriate to address the aims?", "Was the recruitment strategy appropriate to the aims?",
      "Was the data collected in a way that addressed the research issue?", "Has the relationship between researcher and participants been adequately considered?",
      "Have ethical issues been taken into consideration?", "Was the data analysis sufficiently rigorous?",
      "Is there a clear statement of findings?", "How valuable is the research?",
    ],
  },
  jbi: {
    name: "JBI (cross-sectional)",
    questions: [
      "Were the criteria for inclusion in the sample clearly defined?", "Were the study subjects and the setting described in detail?",
      "Was the exposure measured in a valid and reliable way?", "Were objective, standard criteria used for measurement of the condition?",
      "Were confounding factors identified?", "Were strategies to deal with confounding factors stated?",
      "Were the outcomes measured in a valid and reliable way?", "Was appropriate statistical analysis used?",
    ],
  },
  econ: {
    name: "Empirical economics (the studio's own)",
    questions: [
      "Is the identification strategy stated and defended?", "Is the data source named and reachable?",
      "Are standard errors clustered or robust where the design needs it?", "Are the results robust to the alternative specifications reported?",
      "Is the sample period and the sample size stated?", "Are the code and data available for replication?",
    ],
  },
};

/** A checklist's score: yes counts one, unclear a half, no nothing. */
export const appraisalScore = (answers: Record<string, "yes" | "no" | "unclear" | undefined>, questions: string[]): number =>
  questions.reduce((n, _q, i) => n + (answers[String(i)] === "yes" ? 1 : answers[String(i)] === "unclear" ? 0.5 : 0), 0);

/* ---------- PRISMA 2020, derived ---------- */

export interface PrismaCounts {
  identified: number;
  byDatabase: Record<string, number>;
  duplicates: number;
  screened: number;
  excludedAtTitle: number;
  soughtFullText: number;
  excludedAtFullText: number;
  byReason: Record<string, number>;
  included: number;
  /** Still waiting for a decision at each stage. */
  pending: { title: number; fulltext: number };
}

/** The flow diagram's boxes out of the records: what was found,
    what fell out as a duplicate, what was screened, what went to
    full text, what was excluded there and why, what is in. A
    record's stage says how far it got, and an exclusion's
    `reason` says why; a record still at `title` or `fulltext` is
    pending and is counted as such rather than as anything else. */
export function prisma(records: { database: string; stage: RecordStage; reason?: string | null; record?: { fullText?: boolean } }[]): PrismaCounts {
  const byDatabase: Record<string, number> = {};
  const byReason: Record<string, number> = {};
  let duplicates = 0, excludedAtTitle = 0, excludedAtFullText = 0, included = 0, pendingTitle = 0, pendingFull = 0, reachedFull = 0;
  for (const r of records) {
    byDatabase[r.database || "?"] = (byDatabase[r.database || "?"] ?? 0) + 1;
    if (r.stage === "deduplicated") { duplicates += 1; continue; }
    if (r.stage === "found" || r.stage === "title") { pendingTitle += 1; continue; }
    if (r.stage === "fulltext") { pendingFull += 1; reachedFull += 1; continue; }
    if (r.stage === "included") { included += 1; reachedFull += 1; continue; }
    if (r.stage === "excluded") {
      if (r.record?.fullText) { excludedAtFullText += 1; reachedFull += 1; byReason[r.reason ?? "?"] = (byReason[r.reason ?? "?"] ?? 0) + 1; }
      else excludedAtTitle += 1;
    }
  }
  const identified = records.length;
  return {
    identified, byDatabase, duplicates,
    screened: identified - duplicates,
    excludedAtTitle,
    soughtFullText: reachedFull,
    excludedAtFullText, byReason, included,
    pending: { title: pendingTitle, fulltext: pendingFull },
  };
}

/** The same key the library uses, so a record found twice across
    two databases is one record. */
export const recordKey = (r: { doi?: string | null; hash: string }): string =>
  r.doi ? `doi:${r.doi.toLowerCase()}` : `hash:${r.hash}`;

/** The duplicates among a set of records, by DOI then by hash:
    the ids of every record after the first with the same key. */
export function duplicatesOf(records: { id: string; doi?: string | null; hash: string; created_at: string }[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of [...records].sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    const k = recordKey(r);
    if (seen.has(k)) out.push(r.id); else seen.add(k);
  }
  return out;
}
