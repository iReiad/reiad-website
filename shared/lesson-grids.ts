/* ============================================================
   lesson-grids.ts: a sheet a reader types into.

   The eleven block kinds before this one all had the reader
   CHOOSING: an option, an order, a bucket, a slider. None of them
   had the reader TYPING a number into a cell and watching another
   cell answer, which is how anybody has ever actually learnt a
   profit and loss account, a loan schedule or a budget. You do
   not learn what interest does by reading that it compounds. You
   learn it by putting 12 in a box and watching the last row move.

   ---- one kind, two jobs, and that is not a compromise ----

   A cell here is one of three things: `given`, which is printed;
   `input`, which the reader fills; and `calc`, which is computed
   from the others. A grid of `input` cells carrying `expect` is a
   drill, and a grid of `calc` cells is a spreadsheet. They are
   the same object because they are the same THING: a table with
   holes in it and a rule for what belongs in each hole.

   That is what lets the three language schools have one at all.
   A German verb's six forms, an English tense's five, an Arabic
   root's derived stems: each is a table with holes in it, and
   until now the only interactive a language lesson could carry
   was a multiple-choice question. `check-money.ts` counts 81
   money lessons with blocks and 0 across the other three.

   ---- what a formula may be ----

   A `calc` cell names other cells and one operation. NOT an
   expression string, and the difference is the whole safety
   argument: an expression has to be parsed, and a parser that
   takes arithmetic out of a database row is an evaluator with a
   database in front of it. A named operation over named cells
   cannot be anything else.

   ---- why the models are here ----

   Same reason `lesson-labs.ts` holds the labs: the Worker sends
   these rows to the Android app, the site renders them, and a
   check reads them under node. A grid whose arithmetic lived in a
   component would be a grid the app could not compute.
   ============================================================ */

import { bnNum } from "./schools.ts";

/** Both languages, like every other string in a lesson. */
export interface Say { bn: string; en: string }

export type CellFmt = "taka" | "pct" | "num" | "text";

/** What one cell is.

    `given` is printed and cannot be changed. `input` is the
    reader's, and `expect` where there is a right answer. `calc`
    is computed from `from` by `op`, and is never typed into. */
export interface GridCell {
  kind: "given" | "input" | "calc";
  /** For `given` and for a `text` input, the words. */
  say?: Say;
  /** For `given` in a number column, the number. */
  value?: number;
  /** For `input`, what the reader starts with, so a sheet opens
      as a worked example rather than as an empty form. */
  start?: number;
  /** For `input`, the right answer, which turns a sheet into a
      drill. A number column compares numbers; a text column
      compares words, case-folded and trimmed. */
  expect?: number;
  expectSay?: string;
  /** For `calc`: which cells, and what to do with them. */
  from?: string[];
  op?: "sum" | "diff" | "product" | "ratio" | "pct" | "mean";
  /** A constant the operation uses, for `pct` (per cent of) and
      for `product` where one side is not a cell. */
  by?: number;
  /** One line under it, for the cell that needs explaining. */
  note?: Say;
  /** How THIS cell is written, where it is not what the rest of
      the sheet is. A profit and loss account is in taka down to
      its last row, which is a margin in per cent: one format for
      the whole table wrote that row as `15` and left a reader to
      guess whether fifteen taka or fifteen per cent. */
  fmt?: CellFmt;
}

export interface GridRow {
  id: string;
  label: Say;
  cells: GridCell[];
  /** A row that is a total, an answer, or the line the lesson is
      really about, drawn heavier. */
  lead?: boolean;
}

export interface GridModel {
  id: string;
  title: Say;
  /** The column headings, after the row-label column. */
  columns: Say[];
  /** What the numbers are, where they are all the same thing. */
  fmt: CellFmt;
  rows: GridRow[];
  /** One sentence under it that changes with what was typed.
      Given the cell values by id, in the same shape `run` on a
      lab gets its inputs. */
  verdict?(at: (id: string) => number): { tone: "good" | "warn" | "bad"; text: Say };
}

/* ------------------------------------------------------------
   Helpers, so a model is its table and nothing else
   ------------------------------------------------------------ */

const S = (bn: string, en: string): Say => ({ bn, en });

const word = (bn: string, en: string): GridCell => ({ kind: "given", say: S(bn, en) });
const input = (start: number, extra: Partial<GridCell> = {}): GridCell =>
  ({ kind: "input", start, ...extra });
const ask = (expectSay: string): GridCell => ({ kind: "input", start: 0, expectSay });
const calc = (op: GridCell["op"], from: string[], by?: number): GridCell =>
  ({ kind: "calc", op, from, by });

const row = (id: string, bn: string, en: string, cells: GridCell[], lead = false): GridRow =>
  ({ id, label: S(bn, en), cells, lead });

/** A cell's address, which is how a formula names one: the row's
    id, then the column index. One row of one column is `id`
    alone, because most of these tables are one column wide and
    `revenue.0` reads worse than `revenue` for no gain. */
export const cellAt = (rowId: string, col: number): string =>
  col === 0 ? rowId : `${rowId}.${col}`;

/* ------------------------------------------------------------
   THE OPERATIONS, and the reason there is a list of them

   A formula is an op over cells rather than a string to evaluate.
   Six of them cover every sheet below, which is the argument for
   not building a parser: a seventh is a line here, and a parser
   is a language nobody asked for inside a lesson.
   ------------------------------------------------------------ */
export function applyOp(
  op: NonNullable<GridCell["op"]>, values: number[], by = 0,
): number {
  const clean = values.filter((n) => Number.isFinite(n));
  switch (op) {
    case "sum": return clean.reduce((a, b) => a + b, 0);
    /* The first, less all the rest. A subtraction of a list has
       no other honest reading. */
    case "diff": return clean.length ? clean[0] - clean.slice(1).reduce((a, b) => a + b, 0) : 0;
    case "product": return clean.reduce((a, b) => a * b, by || 1);
    /* A denominator of nought is not an error and not infinity:
       it is a question that has no answer yet, which is what a
       half-filled sheet looks like. */
    case "ratio": return clean[1] ? clean[0] / clean[1] : 0;
    case "pct": return clean[1] ? (clean[0] / clean[1]) * 100 : 0;
    case "mean": return clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : 0;
    default: return 0;
  }
}

/** Every cell's number, with the calc cells resolved.

    Two passes rather than a graph, because every sheet here is
    shallow: a total of inputs, then a ratio of totals, in any
    row order. Three levels of formula written bottom-up would
    need a real toposort and would also be a sheet too clever for
    a lesson. */
export function solve(
  model: GridModel, typed: Record<string, number>,
): Record<string, number> {
  const at: Record<string, number> = {};
  for (const r of model.rows) {
    r.cells.forEach((c, i) => {
      const key = cellAt(r.id, i);
      if (c.kind === "given") at[key] = c.value ?? 0;
      else if (c.kind === "input") at[key] = typed[key] ?? c.start ?? 0;
    });
  }
  /* TWO PASSES, and the second one is not decoration even though
     every sheet that ships would answer without it: all six list
     their rows in the order their formulas need, and a model is a
     table somebody writes, so a total above the things it totals
     is a thing somebody will write. `next/lesson.test.ts` has
     that case, because none of the six does. */
  for (let pass = 0; pass < 2; pass += 1) {
    for (const r of model.rows) {
      r.cells.forEach((c, i) => {
        if (c.kind !== "calc" || !c.op) return;
        at[cellAt(r.id, i)] = applyOp(c.op, (c.from ?? []).map((k) => at[k] ?? 0), c.by);
      });
    }
  }
  return at;
}

/* ------------------------------------------------------------
   The sheets
   ------------------------------------------------------------ */

const MODELS: GridModel[] = [

  /* ---------- money: what a company earned ---------- */
  {
    id: "pnl",
    title: S("লাভ-ক্ষতির হিসাব নিজে বানান", "Build a profit and loss account"),
    columns: [S("এই বছর", "This year"), S("গত বছর", "Last year")],
    fmt: "taka",
    rows: [
      row("revenue", "বিক্রি", "Revenue", [input(9500), input(8200)]),
      row("cogs", "পণ্যের খরচ", "Cost of sales", [input(5300), input(4700)]),
      row("gross", "মোট মুনাফা", "Gross profit",
        [calc("diff", ["revenue", "cogs"]), calc("diff", ["revenue.1", "cogs.1"])], true),
      row("opex", "পরিচালন খরচ", "Operating costs", [input(2100), input(1900)]),
      row("ebit", "পরিচালন মুনাফা", "Operating profit",
        [calc("diff", ["gross", "opex"]), calc("diff", ["gross.1", "opex.1"])], true),
      row("interest", "সুদ", "Interest", [input(280), input(310)]),
      row("tax", "কর", "Tax", [input(390), input(330)]),
      row("net", "নিট মুনাফা", "Net profit",
        [calc("diff", ["ebit", "interest", "tax"]),
         calc("diff", ["ebit.1", "interest.1", "tax.1"])], true),
      row("margin", "নিট মার্জিন, %", "Net margin, %",
        [{ ...calc("pct", ["net", "revenue"]), fmt: "pct" },
         { ...calc("pct", ["net.1", "revenue.1"]), fmt: "pct" }]),
    ],
    verdict: (at) => {
      const now = at("margin");
      const was = at("margin.1");
      if (now <= 0) {
        return { tone: "bad", text: S(
          "এই বছর কোম্পানিটি লোকসানে। বিক্রি বাড়ালেই সেটা ঠিক হয় না: খরচের সারিগুলো দেখুন।",
          "The company lost money this year. More revenue alone does not fix that: look at the cost rows.") };
      }
      if (now < was - 0.5) {
        return { tone: "warn", text: S(
          "মার্জিন গত বছরের চেয়ে কমেছে। বিক্রি বাড়লেও মার্জিন কমতে পারে, আর সেটাই বেশি জরুরি প্রশ্ন।",
          "The margin is thinner than last year. Revenue can rise while the margin falls, and the margin is the more important question.") };
      }
      return { tone: "good", text: S(
        "মার্জিন ধরে রেখেছে বা বেড়েছে। এখন প্রশ্ন হলো এটা টেকসই কি না।",
        "The margin held or improved. The next question is whether that is repeatable.") };
    },
  },

  /* ---------- money: what a loan really costs ---------- */
  {
    id: "loan-year",
    title: S("ঋণের প্রথম তিন বছর", "The first three years of a loan"),
    columns: [S("টাকা", "Amount")],
    fmt: "taka",
    rows: [
      row("open", "শুরুর বকেয়া", "Opening balance", [input(500000)]),
      row("rate", "সুদের হার, %", "Interest rate, %", [input(11, { fmt: "pct" })]),
      row("pay", "বছরে যা দিচ্ছেন", "Paid per year", [input(120000)]),
      /* open x rate x 0.01, and the 0.01 is `by` rather than a
         hidden row holding 100. A model that needs a spare row to
         carry a constant is a model with a hole in its op list,
         and an empty row is a row the reader can see. */
      row("int1", "বছর ১: সুদ", "Year 1: interest",
        [calc("product", ["open", "rate"], 0.01)]),
      row("cut1", "বছর ১: আসল কমল", "Year 1: principal cleared",
        [calc("diff", ["pay", "int1"])], true),
      row("bal1", "বছর ১ শেষে বকেয়া", "Balance after year 1",
        [calc("diff", ["open", "cut1"])], true),
    ],
    verdict: (at) => {
      const paid = at("pay");
      const interest = at("int1");
      if (paid <= interest) {
        return { tone: "bad", text: S(
          "আপনি সুদটুকুও শোধ করছেন না। বকেয়া প্রতি বছর বাড়বে, যতই টাকা দিন।",
          "You are not covering the interest. The balance grows every year, however much you pay.") };
      }
      const share = interest / paid;
      if (share > 0.5) {
        return { tone: "warn", text: S(
          "যা দিচ্ছেন তার অর্ধেকের বেশি সুদেই যাচ্ছে। আসল কমছে খুব ধীরে।",
          "More than half of what you pay is interest. The principal is barely moving.") };
      }
      return { tone: "good", text: S(
        "বেশিরভাগ টাকা আসল কমাচ্ছে, যেটাই ঋণ শেষ করার একমাত্র পথ।",
        "Most of the payment is clearing principal, which is the only thing that ends a loan.") };
    },
  },

  /* ---------- money: where the month goes ---------- */
  {
    id: "budget",
    title: S("মাসটা কোথায় যায়", "Where the month goes"),
    columns: [S("টাকা", "Taka")],
    fmt: "taka",
    rows: [
      row("income", "হাতে আসা আয়", "Money in", [input(45000)]),
      row("rent", "বাসা ভাড়া", "Rent", [input(15000)]),
      row("food", "খাওয়া", "Food", [input(9000)]),
      row("travel", "যাতায়াত", "Getting about", [input(3000)]),
      row("bills", "বিল ও ফোন", "Bills and phone", [input(4000)]),
      row("other", "বাকি সব", "Everything else", [input(6000)]),
      row("spent", "মোট খরচ", "Total out",
        [calc("sum", ["rent", "food", "travel", "bills", "other"])], true),
      row("left", "যা থাকল", "What is left",
        [calc("diff", ["income", "spent"])], true),
      row("rate", "সঞ্চয়ের হার, %", "Savings rate, %",
        [{ ...calc("pct", ["left", "income"]), fmt: "pct" }], true),
    ],
    verdict: (at) => {
      const rate = at("rate");
      if (rate < 0) {
        return { tone: "bad", text: S(
          "প্রতি মাসে আয়ের চেয়ে খরচ বেশি। এটা ধার বা সঞ্চয় ভাঙা দিয়ে চলছে, আর দুটোই ফুরিয়ে যায়।",
          "You spend more than you earn each month. That runs on debt or on savings, and both run out.") };
      }
      if (rate < 10) {
        return { tone: "warn", text: S(
          "দশ শতাংশের নিচে সঞ্চয় মানে একটা খারাপ মাস পুরো বছরটা খেয়ে ফেলতে পারে।",
          "Under ten per cent, one bad month eats the year.") };
      }
      return { tone: "good", text: S(
        "এই হারে সঞ্চয় হলে জরুরি তহবিল গড়া সম্ভব। প্রথমে সেটা, তারপর বিনিয়োগ।",
        "At this rate an emergency fund is reachable. That first, then investing.") };
    },
  },

  /* ---------- deutsch: the six forms ---------- */
  {
    id: "de-praesens",
    title: S("nehmen: বর্তমান কাল", "nehmen: the present tense"),
    columns: [S("রূপ", "Form")],
    fmt: "text",
    rows: [
      row("ich", "ich", "ich", [word("nehme", "nehme")]),
      row("du", "du", "du", [ask("nimmst")]),
      row("er", "er / sie / es", "er / sie / es", [ask("nimmt")]),
      row("wir", "wir", "wir", [ask("nehmen")]),
      row("ihr", "ihr", "ihr", [ask("nehmt")]),
      row("sie", "sie / Sie", "sie / Sie", [ask("nehmen")]),
    ],
  },

  /* ---------- english: one verb, five shapes ---------- */
  {
    id: "en-forms",
    title: S("একটি ক্রিয়ার পাঁচ রূপ", "One verb, five shapes"),
    columns: [S("রূপ", "Form")],
    fmt: "text",
    rows: [
      row("base", "base", "base", [word("write", "write")]),
      row("s", "he / she", "he / she", [ask("writes")]),
      row("ing", "-ing", "-ing", [ask("writing")]),
      row("past", "past", "past", [ask("wrote")]),
      row("pp", "past participle", "past participle", [ask("written")]),
    ],
  },

  /* ---------- quran: one root, four words ---------- */
  {
    id: "ar-root",
    title: S("ك-ت-ب মূল থেকে", "From the root k-t-b"),
    columns: [S("শব্দ", "Word")],
    fmt: "text",
    rows: [
      row("verb", "সে লিখল", "he wrote", [word("كَتَبَ", "كَتَبَ")]),
      row("doer", "লেখক", "the one who writes", [ask("كاتب")]),
      row("thing", "লেখা, বই", "what is written, a book", [ask("كتاب")]),
      row("place", "লেখার জায়গা, অফিস", "the place of writing, an office", [ask("مكتب")]),
    ],
  },
];

export const GRIDS: Record<string, GridModel> = Object.fromEntries(
  MODELS.map((m) => [m.id, m]),
);

export const GRID_IDS: readonly string[] = MODELS.map((m) => m.id);

/** What a sheet opens at, for the server render and for a check
    that wants the answer without a browser. */
export const gridStart = (model: GridModel): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const r of model.rows) {
    r.cells.forEach((c, i) => {
      if (c.kind === "input") out[cellAt(r.id, i)] = c.start ?? 0;
    });
  }
  return out;
};

/** A number written out, in the reader's language. Here rather
    than in the component for the reason `lesson-labs.ts` gives:
    the Android app formats the same values and a second
    implementation is a second set of rounding rules. */
export function sayNumber(n: number, fmt: CellFmt, lang: "bn" | "en"): string {
  if (!Number.isFinite(n)) return "–";
  if (fmt === "pct") {
    const s = `${n.toFixed(1)}%`;
    return lang === "bn" ? bnNum(s) : s;
  }
  const rounded = Math.round(n);
  const s = rounded.toLocaleString(lang === "bn" ? "en-IN" : "en-US");
  return lang === "bn" ? bnNum(s) : s;
}
