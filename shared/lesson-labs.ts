/* ============================================================
   lesson-labs.ts: the arithmetic behind every `lab` block.

   A lab is sliders, a number that moves and usually a chart. The
   BLOCK is data in a database row and says which model to run;
   the MODEL is here, and it is code.

   That line is the one CLAUDE.md draws for the whole site: a
   piece, a lesson, a count reaches the Android app on its next
   fetch, and a calculator's arithmetic needs a release. A
   formula stored as a string in a row would be code sitting
   where nothing typechecks it, nothing tests it and the
   sanitiser cannot see it.

   ---- a model owns its inputs, not only its sum ----

   The range, the step, the unit and the default of every slider
   are here rather than in the block. A lesson that wanted a
   different starting point moves it with `preset`, and a lesson
   cannot invent a slider the model does not read. So a model is
   one thing to get right and eighty rows cannot drift from it.

   ---- what a model may not do ----

   Reach the network, read the clock, or read a reader's account.
   A lab is a thing somebody can move and re-run and get the same
   answer from, which is the whole of why it teaches anything.
   Money is taka throughout; nothing here converts a currency.

   ---- and the numbers are honest about being estimates ----

   Every rate is an assumption the reader moves, and no model
   returns a projection dressed as a fact. Where a model's answer
   depends on something this site cannot know, it says so in its
   verdict rather than quietly picking a value.
   ============================================================ */

import { bnNum, type Say, type Tone } from "./lesson.ts";

/* ------------------------------------------------------------
   Shapes
   ------------------------------------------------------------ */

/** How a number is written out. The component formats, because
    only the component knows which language the reader is in. */
export type Fmt = "taka" | "pct" | "num" | "year" | "month" | "times" | "day";

export interface LabInput {
  id: string;
  label: Say;
  min: number;
  max: number;
  step: number;
  /** The value the lab opens at, which a block may move with
      `preset` and may not remove. */
  value: number;
  fmt: Fmt;
  /** One line under the slider, where the thing being moved is
      not obvious from its name. */
  note?: Say;
}

export interface LabOut {
  label: Say;
  value: number;
  fmt: Fmt;
  tone?: Tone;
  /** The one the eye should land on. A lab with three big
      outputs has no answer, it has three. */
  big?: boolean;
  note?: Say;
}

export interface LabChart {
  shape: "line" | "bar" | "stack";
  labels: string[];
  series: { name: Say; values: number[]; tone?: Tone }[];
  unit?: Say;
}

export interface LabResult {
  outs: LabOut[];
  chart?: LabChart;
  /** One sentence that changes as the sliders move, which is
      what turns a calculator into a lesson. */
  verdict?: { tone: Tone; text: Say };
}

export interface LabModel {
  id: string;
  title: Say;
  inputs: LabInput[];
  run(v: Record<string, number>): LabResult;
}

/* ------------------------------------------------------------
   Small helpers, so a model is its arithmetic and nothing else
   ------------------------------------------------------------ */

const S = (bn: string, en: string): Say => ({ bn, en });

const inp = (
  id: string, bn: string, en: string,
  min: number, max: number, step: number, value: number, fmt: Fmt, note?: Say
): LabInput => ({ id, label: S(bn, en), min, max, step, value, fmt, note });

const out = (
  bn: string, en: string, value: number, fmt: Fmt,
  extra: { tone?: Tone; big?: boolean; note?: Say } = {}
): LabOut => ({ label: S(bn, en), value, fmt, ...extra });

/** A number inside a sentence, in the language of that half of
    the sentence. Taka is written with the sign in both, because
    that is how a price is written on both sides of a Bangla
    newspaper's business page. */
const bdt = (n: number): string => {
  const rounded = Math.round(n);
  const grouped = Math.abs(rounded) >= 100000
    ? `${(rounded / 100000).toFixed(rounded >= 1000000 ? 0 : 1)} lakh`
    : rounded.toLocaleString("en-US");
  return grouped;
};

/** The same, in Bangla, with লাখ and কোটি rather than a comma
    every three digits. A Bangla reader groups by two after the
    first three, and writing 12,50,000 as 1,250,000 is a number
    they have to stop and re-read. */
const bnTaka = (n: number): string => {
  const r = Math.round(n);
  if (Math.abs(r) >= 10000000) return `${bnNum((r / 10000000).toFixed(2))} কোটি`;
  if (Math.abs(r) >= 100000) return `${bnNum((r / 100000).toFixed(r >= 1000000 ? 1 : 2))} লাখ`;
  return bnNum(r.toLocaleString("en-IN"));
};

const pair = (bn: string, en: string): Say => S(bn, en);

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/** A geometric run of yearly values, which four models want. */
const grow = (start: number, monthly: number, rate: number, years: number): number[] => {
  const r = rate / 100;
  const values: number[] = [start];
  let pot = start;
  for (let y = 1; y <= years; y += 1) {
    /* Monthly money goes in through the year, so it earns about
       half a year's return on average. Compounding it monthly
       inside the loop would be more exact and would also make
       every figure on the page depend on a detail no reader can
       check; half a year is the honest approximation and the
       comment is the disclosure. */
    pot = pot * (1 + r) + monthly * 12 * (1 + r / 2);
    values.push(pot);
  }
  return values;
};

const years = (n: number): string[] =>
  Array.from({ length: n + 1 }, (_, i) => String(i));

/* ------------------------------------------------------------
   The models
   ------------------------------------------------------------ */

const MODELS: LabModel[] = [

  /* ---------- পর্যায় ০: before any of it ---------- */

  {
    id: "savings-rate",
    title: S("কত টাকা আলাদা রাখতে পারছেন", "How much you actually keep"),
    inputs: [
      inp("income", "মাসিক আয়", "Monthly income", 5000, 300000, 1000, 40000, "taka"),
      inp("spend", "মাসিক খরচ", "Monthly spending", 3000, 250000, 1000, 32000, "taka"),
    ],
    run: (v) => {
      const keep = Math.max(0, v.income - v.spend);
      const rate = v.income > 0 ? (keep / v.income) * 100 : 0;
      const monthsPerYear = rate > 0 ? (keep * 12) / Math.max(1, v.spend) : 0;
      return {
        outs: [
          out("মাসে জমছে", "Kept each month", keep, "taka", { big: true, tone: keep > 0 ? "good" : "bad" }),
          out("আয়ের কত অংশ", "Share of income", rate, "pct", { tone: rate >= 20 ? "good" : rate >= 10 ? "warn" : "bad" }),
          out("বছরে যত মাসের খরচ জমে", "Months of spending saved per year", monthsPerYear, "month"),
        ],
        verdict: {
          tone: rate >= 20 ? "good" : rate >= 10 ? "warn" : "bad",
          text: rate <= 0
            ? S("খরচ আয়ের সমান বা বেশি। বিনিয়োগের আগে এই ফাঁকটা বন্ধ করাই প্রথম কাজ, আর সেটা কোনো শেয়ার কেনার চেয়ে বড় লাভ।",
                "Spending matches or beats income. Closing that gap comes before any investment, and it pays better than any share would.")
            : rate < 10
              ? S(`আয়ের ${bnNum(rate.toFixed(0))}% জমছে। শুরু হিসেবে খারাপ না, কিন্তু এই হারে জরুরি তহবিল গড়তেই কয়েক বছর লাগবে।`,
                  `You keep ${rate.toFixed(0)}% of what you earn. It is a start, but at this rate the emergency fund alone takes years.`)
              : rate < 20
                ? S(`আয়ের ${bnNum(rate.toFixed(0))}% জমছে। এটা কাজ করবে। খরচের এক-দুইটা বড় লাইন কমাতে পারলে গতি অনেক বাড়ে।`,
                    `You keep ${rate.toFixed(0)}%. This works. Trimming one or two big spending lines speeds it up a lot.`)
                : S(`আয়ের ${bnNum(rate.toFixed(0))}% জমছে, যা বেশ ভালো। এখন প্রশ্নটা কত জমছে না, প্রশ্নটা জমা টাকা কোথায় রাখছেন।`,
                    `You keep ${rate.toFixed(0)}%, which is strong. The question stops being how much and becomes where you put it.`),
        },
      };
    },
  },

  {
    id: "emergency",
    title: S("জরুরি তহবিল", "The emergency fund"),
    inputs: [
      inp("spend", "মাসিক খরচ", "Monthly spending", 5000, 200000, 1000, 30000, "taka"),
      inp("months", "কত মাসের খরচ ধরে রাখবেন", "Months of cover", 3, 12, 1, 6, "month"),
      inp("have", "এখন হাতে আছে", "Saved already", 0, 1000000, 5000, 40000, "taka"),
      inp("save", "মাসে জমাতে পারবেন", "Can save monthly", 500, 100000, 500, 8000, "taka"),
    ],
    run: (v) => {
      const target = v.spend * v.months;
      const gap = Math.max(0, target - v.have);
      const toGo = gap > 0 ? Math.ceil(gap / Math.max(1, v.save)) : 0;
      const path: number[] = [];
      let pot = v.have;
      const span = Math.max(6, Math.min(36, toGo + 2));
      for (let m = 0; m <= span; m += 1) { path.push(Math.min(pot, target * 1.2)); pot += v.save; }
      return {
        outs: [
          out("লক্ষ্য", "Target", target, "taka", { big: true }),
          out("আর দরকার", "Still needed", gap, "taka", { tone: gap === 0 ? "good" : "warn" }),
          out("কত মাস লাগবে", "Months to get there", toGo, "month", { tone: toGo <= 12 ? "good" : "warn" }),
        ],
        chart: {
          shape: "line",
          labels: Array.from({ length: span + 1 }, (_, i) => String(i)),
          series: [
            { name: S("জমা", "Saved"), values: path, tone: "good" },
            { name: S("লক্ষ্য", "Target"), values: path.map(() => target), tone: "plain" },
          ],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: gap === 0 ? "good" : "warn",
          text: gap === 0
            ? S("তহবিল ভরা। এখান থেকে যা জমবে সেটাই বিনিয়োগের টাকা, আর সেই টাকাটা হারালে মাসটা নষ্ট হবে না।",
                "The fund is full. Everything saved from here is investable, and losing some of it will not wreck a month.")
            : S(`মাসে ${bnTaka(v.save)} টাকা করে রাখলে ${bnNum(toGo)} মাসে ভরবে। ততদিন শেয়ার কেনা মানে ঠিক যে মাসে টাকা লাগবে সেই মাসে বেচতে বাধ্য হওয়া।`,
                `At ${bdt(v.save)} taka a month it fills in ${toGo} months. Buying shares before then means being forced to sell in the month you need the money.`),
        },
      };
    },
  },

  {
    id: "compound",
    title: S("চক্রবৃদ্ধি", "Compounding"),
    inputs: [
      inp("start", "শুরুর টাকা", "Starting amount", 0, 2000000, 5000, 50000, "taka"),
      inp("monthly", "প্রতি মাসে", "Added every month", 0, 100000, 500, 5000, "taka"),
      inp("rate", "বছরে গড় রিটার্ন", "Average yearly return", 0, 20, 0.5, 10, "pct",
        S("অনুমান, প্রতিশ্রুতি নয়। কেউ জানে না আগামী দশ বছর কী হবে।",
          "An assumption, not a promise. Nobody knows the next ten years.")),
      inp("years", "কত বছর", "For how many years", 1, 40, 1, 20, "year"),
    ],
    run: (v) => {
      const path = grow(v.start, v.monthly, v.rate, v.years);
      const final = path[path.length - 1];
      const putIn = v.start + v.monthly * 12 * v.years;
      const earned = final - putIn;
      const paidIn = path.map((_, y) => v.start + v.monthly * 12 * y);
      return {
        outs: [
          out("শেষে দাঁড়াবে", "You end with", final, "taka", { big: true, tone: "good" }),
          out("নিজে দিয়েছেন", "You put in", putIn, "taka"),
          out("টাকা নিজে বানিয়েছে", "The money earned", earned, "taka", { tone: earned > putIn ? "good" : "plain" }),
        ],
        chart: {
          shape: "line",
          labels: years(v.years),
          series: [
            { name: S("মোট", "Total"), values: path, tone: "good" },
            { name: S("নিজের দেওয়া", "What you paid in"), values: paidIn, tone: "plain" },
          ],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: earned > putIn ? "good" : "plain",
          text: earned > putIn
            ? S(`${bnNum(v.years)} বছর পর টাকাটা আপনার চেয়ে বেশি এনেছে: আপনার ${bnTaka(putIn)}, তার ${bnTaka(earned)}। এই মোড়টাই চক্রবৃদ্ধি, আর এটা সময়ের কাজ, চালাকির না।`,
                `After ${v.years} years the money has brought in more than you have: yours ${bdt(putIn)}, its ${bdt(earned)}. That crossover is compounding, and it is bought with time, not cleverness.`)
            : S(`এখনো বেশিরভাগটাই আপনার নিজের দেওয়া টাকা। বছর বাড়িয়ে দেখুন, কোথায় গিয়ে বাঁকটা খাড়া হয়।`,
                `Most of it is still your own money. Push the years out and watch where the curve turns steep.`),
        },
      };
    },
  },

  {
    id: "rule72",
    title: S("কত বছরে দ্বিগুণ", "How long to double"),
    inputs: [
      inp("rate", "বছরে রিটার্ন", "Yearly return", 1, 25, 0.5, 8, "pct"),
    ],
    run: (v) => {
      const y = 72 / Math.max(0.1, v.rate);
      const rates = [4, 6, 8, 10, 12, 15];
      return {
        outs: [
          out("দ্বিগুণ হতে", "To double", y, "year", { big: true }),
          out("চারগুণ হতে", "To quadruple", y * 2, "year"),
        ],
        chart: {
          shape: "bar",
          labels: rates.map(String),
          series: [{ name: S("বছর", "Years"), values: rates.map((r) => 72 / r), tone: "lead" }],
          unit: S("বছর", "years"),
        },
        verdict: {
          tone: "plain",
          text: S(`৭২ কে হার দিয়ে ভাগ। ${bnNum(v.rate)}% হলে ${bnNum(y.toFixed(1))} বছর। মাথার ভেতর করা যায়, আর এইজন্যই এটা কাজের: ক্যালকুলেটর খুলতে হয় না বলে আপনি আসলেই করবেন।`,
                `Divide 72 by the rate. At ${v.rate}% that is ${y.toFixed(1)} years. You can do it in your head, which is why it is useful: you will actually do it.`),
        },
      };
    },
  },

  {
    id: "inflation",
    title: S("মূল্যস্ফীতি টাকার কী করে", "What inflation does to money"),
    inputs: [
      inp("amount", "আজকের টাকা", "Amount today", 1000, 5000000, 1000, 100000, "taka"),
      inp("rate", "বছরে মূল্যস্ফীতি", "Yearly inflation", 0, 15, 0.5, 9, "pct"),
      inp("years", "কত বছর পর", "Years from now", 1, 30, 1, 10, "year"),
    ],
    run: (v) => {
      const factor = Math.pow(1 + v.rate / 100, v.years);
      const worth = v.amount / factor;
      const path = Array.from({ length: v.years + 1 }, (_, y) => v.amount / Math.pow(1 + v.rate / 100, y));
      const lost = v.amount - worth;
      return {
        outs: [
          out("তখন যা কিনতে পারবে", "What it will buy", worth, "taka", { big: true, tone: "bad" }),
          out("ক্রয়ক্ষমতা হারাল", "Buying power lost", lost, "taka", { tone: "bad" }),
          out("তখনকার দামে আজকের জিনিস", "Same basket then costs", v.amount * factor, "taka"),
        ],
        chart: {
          shape: "line",
          labels: years(v.years),
          series: [
            { name: S("আজকের টাকায় মূল্য", "Worth in today's money"), values: path, tone: "bad" },
            { name: S("অঙ্ক", "The number on the note"), values: path.map(() => v.amount), tone: "plain" },
          ],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: "bad",
          text: S(`অঙ্কটা বদলায় না, কেনার ক্ষমতা বদলায়। ${bnNum(v.rate)}% হারে ${bnNum(v.years)} বছরে ${bnTaka(v.amount)} টাকার জোর কমে ${bnTaka(worth)} টাকায় নামে। বালিশের নিচে টাকা রাখা তাই নিরাপদ না, নীরব।`,
                `The number does not change, the power does. At ${v.rate}% over ${v.years} years, ${bdt(v.amount)} taka has the strength of ${bdt(worth)}. Cash under a mattress is not safe, it is quiet.`),
        },
      };
    },
  },

  {
    id: "fdr-real",
    title: S("এফডিআরের আসল রিটার্ন", "What an FDR really returns"),
    inputs: [
      inp("rate", "ঘোষিত সুদের হার", "Advertised rate", 2, 14, 0.25, 8.5, "pct"),
      inp("tax", "উৎসে কর", "Tax at source", 0, 20, 1, 10, "pct"),
      inp("inflation", "মূল্যস্ফীতি", "Inflation", 0, 15, 0.5, 9, "pct"),
    ],
    run: (v) => {
      const afterTax = v.rate * (1 - v.tax / 100);
      const real = ((1 + afterTax / 100) / (1 + v.inflation / 100) - 1) * 100;
      return {
        outs: [
          out("কর কাটার পর", "After tax", afterTax, "pct"),
          out("মূল্যস্ফীতির পর, আসল রিটার্ন", "After inflation, the real return", real, "pct",
            { big: true, tone: real >= 1 ? "good" : real >= 0 ? "warn" : "bad" }),
        ],
        chart: {
          shape: "bar",
          labels: ["1", "2", "3"],
          series: [{
            name: S("হার", "Rate"),
            values: [v.rate, afterTax, real],
            tone: "lead",
          }],
          unit: S("শতাংশ", "percent"),
        },
        verdict: {
          tone: real >= 1 ? "good" : real >= 0 ? "warn" : "bad",
          text: real < 0
            ? S(`আসল রিটার্ন ঋণাত্মক: ${bnNum(real.toFixed(1))}%। অঙ্কে টাকা বাড়ছে, কেনার ক্ষমতায় কমছে। নিরাপদ শোনানো আর নিরাপদ হওয়া এক জিনিস না।`,
                `The real return is negative: ${real.toFixed(1)}%. The number grows and the buying power shrinks. Sounding safe and being safe are different things.`)
            : S(`মূল্যস্ফীতির পর হাতে থাকছে ${bnNum(real.toFixed(1))}%। এফডিআর টাকা রাখে, বাড়ায় সামান্য। জরুরি তহবিলের জন্য ঠিক, বিশ বছরের লক্ষ্যের জন্য না।`,
                `You keep ${real.toFixed(1)}% after inflation. An FDR holds money, it barely grows it. Right for an emergency fund, wrong for a twenty year goal.`),
        },
      };
    },
  },

  {
    id: "goal",
    title: S("লক্ষ্যের জন্য মাসে কত", "Monthly, for a goal"),
    inputs: [
      inp("target", "লক্ষ্য", "Target", 50000, 20000000, 50000, 2000000, "taka"),
      inp("years", "কত বছরে", "In how many years", 1, 30, 1, 10, "year"),
      inp("rate", "বছরে গড় রিটার্ন", "Average yearly return", 0, 18, 0.5, 10, "pct"),
      inp("have", "এখন আছে", "Already saved", 0, 5000000, 10000, 100000, "taka"),
    ],
    run: (v) => {
      const r = v.rate / 100;
      const from = v.have * Math.pow(1 + r, v.years);
      const need = Math.max(0, v.target - from);
      /* The same half-year convention `grow()` uses, so this
         model and `compound` cannot disagree about the same
         savings plan. */
      const perYearFactor = Array.from({ length: v.years }, (_, i) =>
        12 * (1 + r / 2) * Math.pow(1 + r, v.years - 1 - i)).reduce((a, b) => a + b, 0);
      const monthly = perYearFactor > 0 ? need / perYearFactor : need / (v.years * 12);
      const path = grow(v.have, monthly, v.rate, v.years);
      return {
        outs: [
          out("মাসে দরকার", "Needed each month", monthly, "taka", { big: true }),
          out("মোট নিজে দেবেন", "You will pay in", monthly * 12 * v.years, "taka"),
          out("রিটার্ন যোগ করবে", "Returns will add", Math.max(0, v.target - v.have - monthly * 12 * v.years), "taka", { tone: "good" }),
        ],
        chart: {
          shape: "line",
          labels: years(v.years),
          series: [
            { name: S("জমা", "Pot"), values: path, tone: "good" },
            { name: S("লক্ষ্য", "Target"), values: path.map(() => v.target), tone: "plain" },
          ],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: "plain",
          text: S(`মাসে ${bnTaka(monthly)} টাকা। সংখ্যাটা অসম্ভব মনে হলে তিনটা জিনিসের একটা বদলাতে হবে: লক্ষ্য, সময়, বা মাসের সঞ্চয়। রিটার্নের হার বাড়িয়ে দেওয়াটা বদল না, ওটা আশা।`,
                `${bdt(monthly)} taka a month. If that looks impossible, one of three things has to move: the target, the time, or the saving. Raising the return assumption is not a change, it is a wish.`),
        },
      };
    },
  },

  {
    id: "fee-drag",
    title: S("খরচ কত টানে", "What costs drag out"),
    inputs: [
      inp("capital", "পোর্টফোলিও", "Portfolio", 10000, 5000000, 10000, 200000, "taka"),
      inp("commission", "প্রতি লেনদেনে কমিশন", "Commission per trade", 0.1, 1.5, 0.05, 0.4, "pct"),
      inp("trades", "বছরে কতবার কেনাবেচা", "Round trips a year", 0, 60, 1, 12, "times"),
      inp("rate", "খরচ বাদে বছরে রিটার্ন", "Yearly return before costs", 0, 20, 0.5, 12, "pct"),
      inp("years", "কত বছর", "Years", 1, 30, 1, 15, "year"),
    ],
    run: (v) => {
      /* A round trip is a buy and a sell, so the commission is
         paid twice. Getting that wrong halves the answer and is
         the mistake every broker's own calculator makes. */
      const dragPct = v.commission * 2 * v.trades;
      const clean = grow(v.capital, 0, v.rate, v.years);
      const dirty = grow(v.capital, 0, Math.max(-90, v.rate - dragPct), v.years);
      const lost = clean[clean.length - 1] - dirty[dirty.length - 1];
      return {
        outs: [
          out("বছরে খরচ", "Cost each year", dragPct, "pct", { tone: dragPct > 3 ? "bad" : dragPct > 1 ? "warn" : "good" }),
          out(`${bnNum(v.years)} বছরে হারালেন`, `Lost over ${v.years} years`, lost, "taka", { big: true, tone: "bad" }),
          out("যা থাকত", "What it would have been", clean[clean.length - 1], "taka"),
        ],
        chart: {
          shape: "line",
          labels: years(v.years),
          series: [
            { name: S("খরচ ছাড়া", "Without costs"), values: clean, tone: "good" },
            { name: S("খরচসহ", "With costs"), values: dirty, tone: "bad" },
          ],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: dragPct > 2 ? "bad" : "plain",
          text: S(`বছরে ${bnNum(v.trades)} বার হাত বদলালে কমিশনই খেয়ে নেয় বছরে ${bnNum(dragPct.toFixed(1))}%। রিটার্ন অনিশ্চিত, খরচ নিশ্চিত, আর নিশ্চিত জিনিসটাই আপনি নিয়ন্ত্রণ করতে পারেন।`,
                `Turning the portfolio over ${v.trades} times a year hands ${dragPct.toFixed(1)}% to commission. Returns are uncertain and costs are certain, and the certain one is the one you control.`),
        },
      };
    },
  },

  /* ---------- পর্যায় ১: the words, with numbers on them ---------- */

  {
    id: "market-cap",
    title: S("বাজারমূল্য", "Market capitalisation"),
    inputs: [
      inp("price", "শেয়ারের দাম", "Share price", 5, 2000, 1, 45, "taka"),
      inp("shares", "মোট শেয়ার (কোটি)", "Shares in issue (crore)", 0.5, 500, 0.5, 12, "num"),
      inp("float", "সাধারণ বিনিয়োগকারীর হাতে", "Free float", 5, 100, 1, 30, "pct"),
    ],
    run: (v) => {
      const cap = v.price * v.shares * 10000000;
      const free = cap * (v.float / 100);
      return {
        outs: [
          out("বাজারমূল্য", "Market cap", cap, "taka", { big: true }),
          out("যতটা আসলে কেনাবেচা হয়", "Actually tradable", free, "taka", { tone: v.float < 20 ? "warn" : "plain" }),
        ],
        verdict: {
          tone: v.float < 20 ? "warn" : "plain",
          text: v.float < 20
            ? S(`মোট বাজারমূল্য বড় শোনালেও ভাসমান মাত্র ${bnNum(v.float)}%। কম ভাসমান শেয়ারে অল্প টাকাতেই দাম নড়ে, আর সেই নড়াটা চাহিদার খবর না, পাতলা বাজারের খবর।`,
                `The headline cap looks big but only ${v.float}% floats. In a thin float a small order moves the price, and that move is news about the market's thinness, not about demand.`)
            : S(`দাম গুণ শেয়ার সংখ্যা। দাম একা কিছু বলে না: ১০ টাকার শেয়ার ৫০০ টাকার শেয়ারের চেয়ে সস্তা না, কেবল ছোট টুকরায় ভাগ করা।`,
                `Price times shares. Price alone says nothing: a 10 taka share is not cheaper than a 500 taka share, it is cut into smaller pieces.`),
        },
      };
    },
  },

  {
    id: "pe",
    title: S("পিই রেশিও", "The P/E ratio"),
    inputs: [
      inp("price", "দাম", "Price", 5, 1000, 1, 60, "taka"),
      inp("eps", "ইপিএস", "Earnings per share", 0.5, 60, 0.25, 4, "taka"),
      inp("growth", "আয় বছরে কত বাড়ছে", "Yearly earnings growth", -10, 40, 1, 10, "pct"),
    ],
    run: (v) => {
      const pe = v.price / Math.max(0.01, v.eps);
      const yieldPct = (v.eps / Math.max(0.01, v.price)) * 100;
      const payback = pe;
      const path = Array.from({ length: 6 }, (_, y) => v.eps * Math.pow(1 + v.growth / 100, y));
      return {
        outs: [
          out("পিই", "P/E", pe, "times", { big: true, tone: pe > 30 ? "warn" : pe < 8 ? "good" : "plain" }),
          out("আয় হিসেবে রিটার্ন", "Earnings yield", yieldPct, "pct"),
          out("আজকের আয়ে দাম উঠতে", "Years of profit to repay the price", payback, "year"),
        ],
        chart: {
          shape: "bar",
          labels: years(5),
          series: [{ name: S("প্রতি শেয়ারে আয়", "Earnings per share"), values: path, tone: v.growth >= 0 ? "good" : "bad" }],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: pe > 30 ? "warn" : "plain",
          text: S(`পিই ${bnNum(pe.toFixed(1))} মানে আজকের আয়ে দামটা উঠতে ${bnNum(pe.toFixed(0))} বছর। কম পিই সস্তা না আর বেশি পিই দামি না: বাজার আগামী বছরগুলোর আয় নিয়ে কী ভাবছে, পিই সেটাই বলে। ভাবনাটা ভুলও হতে পারে।`,
                `A P/E of ${pe.toFixed(1)} means today's profit takes ${pe.toFixed(0)} years to repay the price. Low is not cheap and high is not dear: a P/E is what the market thinks about the years ahead, and it can be wrong.`),
        },
      };
    },
  },

  {
    id: "dividend",
    title: S("ডিভিডেন্ড ইল্ড", "Dividend yield"),
    inputs: [
      inp("price", "এখনকার দাম", "Price now", 5, 1000, 1, 50, "taka"),
      inp("bought", "যে দামে কিনেছিলেন", "Price you paid", 5, 1000, 1, 30, "taka"),
      inp("dividend", "শেয়ারপ্রতি নগদ ডিভিডেন্ড", "Cash dividend per share", 0, 50, 0.25, 3, "taka"),
      inp("shares", "কতটা শেয়ার", "Shares held", 10, 20000, 10, 500, "num"),
    ],
    run: (v) => {
      const now = (v.dividend / Math.max(0.01, v.price)) * 100;
      const onCost = (v.dividend / Math.max(0.01, v.bought)) * 100;
      const cash = v.dividend * v.shares;
      return {
        outs: [
          out("এখনকার ইল্ড", "Yield now", now, "pct", { big: true }),
          out("আপনার কেনা দামে ইল্ড", "Yield on your cost", onCost, "pct", { tone: onCost > now ? "good" : "plain" }),
          out("বছরে নগদ", "Cash a year", cash, "taka"),
        ],
        verdict: {
          tone: now > 12 ? "warn" : "plain",
          text: now > 12
            ? S(`${bnNum(now.toFixed(1))}% ইল্ড সন্দেহজনকভাবে বেশি। ইল্ড বাড়ার দুইটা কারণ: ডিভিডেন্ড বেড়েছে, নয়তো দাম পড়েছে। দ্বিতীয়টা হলে বাজার সম্ভবত ডিভিডেন্ডটা কাটা পড়বে ধরে নিয়েছে।`,
                `A ${now.toFixed(1)}% yield is suspiciously high. A yield rises for two reasons: the dividend went up, or the price fell. If it is the second, the market is probably pricing in a cut.`)
            : S(`ইল্ড ভগ্নাংশ, আর নিচের সংখ্যাটা আপনার কেনা দাম নয়, আজকের দাম। কেনা দামের ওপর ইল্ড দেখতে ভালো লাগে আর সিদ্ধান্ত নিতে অকেজো: প্রশ্নটা সবসময় আজ এই দামে কিনব কি না।`,
                `Yield is a fraction, and the bottom of it is today's price, not yours. Yield on cost feels good and decides nothing: the question is always whether to buy at today's price.`),
        },
      };
    },
  },

  {
    id: "book-value",
    title: S("বইমূল্য আর পিবি", "Book value and P/B"),
    inputs: [
      inp("assets", "মোট সম্পদ (কোটি টাকা)", "Total assets (crore taka)", 10, 5000, 10, 800, "num"),
      inp("liabilities", "মোট দায় (কোটি টাকা)", "Total liabilities (crore taka)", 0, 4500, 10, 500, "num"),
      inp("shares", "শেয়ার সংখ্যা (কোটি)", "Shares (crore)", 0.5, 200, 0.5, 10, "num"),
      inp("price", "শেয়ারের দাম", "Share price", 5, 1000, 1, 45, "taka"),
    ],
    run: (v) => {
      const equity = v.assets - v.liabilities;
      const perShare = (equity * 10000000) / Math.max(0.01, v.shares * 10000000);
      const pb = v.price / Math.max(0.01, perShare);
      return {
        outs: [
          out("শেয়ারপ্রতি বইমূল্য", "Book value per share", perShare, "taka", { big: true }),
          out("পিবি", "P/B", pb, "times", { tone: pb < 1 ? "good" : pb > 4 ? "warn" : "plain" }),
          out("মালিকদের অংশ", "Owners' share", equity, "num", { note: S("কোটি টাকা", "crore taka") }),
        ],
        verdict: {
          tone: pb < 1 ? "warn" : "plain",
          text: pb < 1
            ? S(`পিবি ১-এর নিচে: বাজার কোম্পানিটাকে তার নিজের হিসাবের চেয়ে কম দামে বেচছে। সস্তা হতে পারে, আবার হিসাবের সম্পদটা আসলে যা লেখা আছে তত দামি না, সেটাও হতে পারে। ব্যাংক আর বস্ত্রখাতে দ্বিতীয়টাই বেশি দেখা যায়।`,
                `P/B under 1: the market prices the company below its own books. That can be cheap, or it can mean the assets are not worth what the books say. In banks and textiles it is usually the second.`)
            : S(`বইমূল্য সম্পদ বিয়োগ দায়। এটা কোম্পানি আজ বন্ধ করে দিলে কাগজে কত থাকত, চলতে থাকলে কত আনবে তা না। এইজন্যই সফটওয়্যার কোম্পানির পিবি বেশি আর ব্যাংকের কম, দুটোই স্বাভাবিক।`,
                `Book value is assets minus debts: what the paper says would be left if it shut today, not what it earns by carrying on. That is why a software firm's P/B is high and a bank's is low, and both are normal.`),
        },
      };
    },
  },

  {
    id: "roe",
    title: S("আরওই ভেঙে দেখা", "ROE, taken apart"),
    inputs: [
      inp("sales", "বিক্রি (কোটি টাকা)", "Sales (crore taka)", 10, 3000, 10, 500, "num"),
      inp("profit", "নিট মুনাফা (কোটি টাকা)", "Net profit (crore taka)", 0, 600, 1, 40, "num"),
      inp("assets", "মোট সম্পদ (কোটি টাকা)", "Total assets (crore taka)", 10, 6000, 10, 700, "num"),
      inp("equity", "মালিকদের অংশ (কোটি টাকা)", "Equity (crore taka)", 5, 3000, 5, 250, "num"),
    ],
    run: (v) => {
      const margin = (v.profit / Math.max(0.01, v.sales)) * 100;
      const turnover = v.sales / Math.max(0.01, v.assets);
      const leverage = v.assets / Math.max(0.01, v.equity);
      const roe = (v.profit / Math.max(0.01, v.equity)) * 100;
      return {
        outs: [
          out("আরওই", "ROE", roe, "pct", { big: true, tone: roe > 15 ? "good" : roe < 5 ? "bad" : "plain" }),
          out("মার্জিন", "Margin", margin, "pct"),
          out("সম্পদের ঘূর্ণন", "Asset turnover", turnover, "times"),
          out("লিভারেজ", "Leverage", leverage, "times", { tone: leverage > 4 ? "warn" : "plain" }),
        ],
        chart: {
          shape: "bar",
          labels: ["1", "2", "3"],
          series: [{ name: S("তিনটা উপাদান", "The three parts"), values: [margin, turnover * 10, leverage * 10], tone: "lead" }],
        },
        verdict: {
          tone: leverage > 4 ? "warn" : roe > 15 ? "good" : "plain",
          text: leverage > 4
            ? S(`আরওই ${bnNum(roe.toFixed(1))}%, কিন্তু লিভারেজ ${bnNum(leverage.toFixed(1))} গুণ। উঁচু আরওইটা ভালো ব্যবসার না, ধার করা টাকার। ধার ভালো বছরে রিটার্ন বাড়ায় আর খারাপ বছরে কোম্পানি মেরে ফেলে।`,
                `ROE is ${roe.toFixed(1)}% on leverage of ${leverage.toFixed(1)}x. The high ROE is borrowed, not earned. Debt lifts returns in a good year and kills the company in a bad one.`)
            : S(`আরওই = মার্জিন × ঘূর্ণন × লিভারেজ। একই ${bnNum(roe.toFixed(1))}% তিনভাবে আসতে পারে, আর তিনটা তিন রকম ব্যবসা: উঁচু মার্জিনের ওষুধ কোম্পানি, দ্রুত ঘূর্ণনের মুদি দোকান, আর ধারে চলা ব্যাংক।`,
                `ROE is margin times turnover times leverage. The same ${roe.toFixed(1)}% arrives three ways, and they are three different businesses: a high margin pharma, a fast turning grocer, a leveraged bank.`),
        },
      };
    },
  },

  {
    id: "liquidity",
    title: S("বেরোতে কত দিন", "How long to get out"),
    inputs: [
      inp("holding", "আপনার পজিশন", "Your position", 5000, 5000000, 5000, 200000, "taka"),
      inp("turnover", "দৈনিক গড় লেনদেন (লাখ টাকা)", "Average daily turnover (lakh taka)", 1, 2000, 1, 30, "num"),
      inp("share", "দিনের কত অংশ আপনি হতে পারেন", "Share of a day's volume you can be", 1, 25, 1, 10, "pct"),
    ],
    run: (v) => {
      const daily = v.turnover * 100000 * (v.share / 100);
      const days = v.holding / Math.max(1, daily);
      return {
        outs: [
          out("বেরোতে লাগবে", "Days to exit", days, "day", { big: true, tone: days > 5 ? "bad" : days > 2 ? "warn" : "good" }),
          out("দিনে বেচা যাবে", "Sellable per day", daily, "taka"),
        ],
        verdict: {
          tone: days > 5 ? "bad" : "plain",
          text: days > 5
            ? S(`${bnNum(days.toFixed(1))} দিন। খারাপ খবর আসার দিনে সবাই একসাথে বেরোতে চায় আর লেনদেন শুকিয়ে যায়, তাই আসল সংখ্যাটা এর চেয়ে খারাপ। তারল্য একটা ঝুঁকি, আর ভালো সময়ে এটা দেখা যায় না।`,
                `${days.toFixed(1)} days. On the day the bad news lands everyone leaves at once and turnover dries up, so the real number is worse. Liquidity is a risk, and it is invisible while things are calm.`)
            : S(`বেরোনো সহজ। এই সংখ্যাটা কেনার আগে দেখার জিনিস, কারণ বেচার দিনে দেখার সময় থাকে না।`,
                `Getting out is easy. This is a number to look at before buying, because on the day you sell there is no time to look.`),
        },
      };
    },
  },

  {
    id: "diversify",
    title: S("কতটা ছড়ানো", "How spread out you are"),
    inputs: [
      inp("holdings", "কতটা কোম্পানি", "How many holdings", 1, 30, 1, 6, "num"),
      inp("biggest", "সবচেয়ে বড়টার ওজন", "Weight of the biggest", 5, 100, 1, 40, "pct"),
      inp("sectors", "কতটা খাত", "How many sectors", 1, 12, 1, 2, "num"),
    ],
    run: (v) => {
      const rest = Math.max(0, 100 - v.biggest);
      const others = Math.max(1, v.holdings - 1);
      const each = rest / others;
      const weights = [v.biggest, ...Array.from({ length: others }, () => each)];
      const hhi = weights.reduce((a, w) => a + (w / 100) * (w / 100), 0);
      const effective = 1 / Math.max(0.0001, hhi);
      const worst = v.biggest;
      return {
        outs: [
          out("কার্যকরভাবে কতটা কোম্পানি", "Effectively this many holdings", effective, "num",
            { big: true, tone: effective >= 8 ? "good" : effective >= 4 ? "warn" : "bad" }),
          out("সবচেয়ে বড়টা শূন্য হলে হারাবেন", "If the biggest goes to zero", worst, "pct", { tone: "bad" }),
          out("খাত", "Sectors", v.sectors, "num", { tone: v.sectors < 3 ? "warn" : "good" }),
        ],
        chart: {
          shape: "bar",
          labels: weights.map((_, i) => String(i + 1)),
          series: [{ name: S("ওজন", "Weight"), values: weights, tone: "lead" }],
          unit: S("শতাংশ", "percent"),
        },
        verdict: {
          tone: effective < 4 || v.sectors < 3 ? "warn" : "good",
          text: v.sectors < 3
            ? S(`${bnNum(v.holdings)}টা কোম্পানি হলেও মাত্র ${bnNum(v.sectors)}টা খাত। একই খাতের দশটা ব্যাংক দশটা কোম্পানি না, একটা বাজি। ডাইভারসিফিকেশন সংখ্যা গোনা না, ঝুঁকিটা আলাদা কি না দেখা।`,
                `${v.holdings} companies but only ${v.sectors} sectors. Ten banks are not ten holdings, they are one bet. Diversification is not counting names, it is checking that the risks differ.`)
            : S(`ওজন বণ্টনের কারণে আপনি আসলে ${bnNum(effective.toFixed(1))}টা কোম্পানির সমান ছড়ানো। সবচেয়ে বড়টায় খারাপ কিছু হলে পোর্টফোলিওর ${bnNum(worst)}% যায়। এই সংখ্যাটা নিয়ে রাতে ঘুম হবে কি না, সেটাই আসল পরীক্ষা।`,
                `Once weights are counted you are as spread as ${effective.toFixed(1)} holdings. If the biggest breaks, ${worst}% of the portfolio goes with it. Whether you can sleep on that number is the real test.`),
        },
      };
    },
  },

  {
    id: "margin",
    title: S("মার্জিন ঋণ কী করে", "What a margin loan does"),
    inputs: [
      inp("own", "নিজের টাকা", "Your own money", 10000, 2000000, 10000, 100000, "taka"),
      inp("ratio", "ঋণ কত গুণ", "Loan, as a multiple", 0, 2, 0.1, 1, "times"),
      inp("fall", "দাম কত পড়ল", "Price falls by", 0, 60, 1, 20, "pct"),
      inp("interest", "ঋণের সুদ", "Interest on the loan", 6, 20, 0.5, 14, "pct"),
    ],
    run: (v) => {
      const loan = v.own * v.ratio;
      const bought = v.own + loan;
      const after = bought * (1 - v.fall / 100);
      const equity = after - loan - loan * (v.interest / 100);
      const lossPct = ((equity - v.own) / v.own) * 100;
      const wipeout = v.ratio > 0 ? (v.own / bought) * 100 : 100;
      const falls = [0, 10, 20, 30, 40, 50];
      return {
        outs: [
          out("এক বছর পর হাতে", "Your money after a year", equity, "taka",
            { big: true, tone: equity <= 0 ? "bad" : equity < v.own ? "warn" : "good" }),
          out("নিজের টাকার কত অংশ গেল", "Change in your own money", lossPct, "pct", { tone: lossPct < 0 ? "bad" : "good" }),
          out("সব শেষ হবে যে পতনে", "Fall that wipes you out", wipeout, "pct", { tone: "bad" }),
        ],
        chart: {
          shape: "bar",
          labels: falls.map(String),
          series: [{
            name: S("নিজের টাকা", "Your money"),
            values: falls.map((f) => (v.own + loan) * (1 - f / 100) - loan - loan * (v.interest / 100)),
            tone: "bad",
          }],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: v.ratio > 0 ? "bad" : "plain",
          text: v.ratio === 0
            ? S("ঋণ নেই, তাই দাম পড়লে আপনি অপেক্ষা করতে পারেন। অপেক্ষা করার ক্ষমতাটাই ছোট বিনিয়োগকারীর সবচেয়ে বড় সুবিধা, আর মার্জিন ঋণ ঠিক ওইটাই বিক্রি করে দেয়।",
                "No loan, so a fall means you can wait. The ability to wait is the small investor's one real advantage, and a margin loan is the sale of exactly that.")
            : S(`দাম মাত্র ${bnNum(wipeout.toFixed(0))}% পড়লেই আপনার নিজের টাকা শূন্য। ব্রোকার তার আগেই বেচে দেবে, সবচেয়ে খারাপ দামে, আর আপনার মত জিজ্ঞেস করবে না। ২০১০ সালে এভাবেই লাখো মানুষ শেষ হয়েছিল।`,
                `A fall of just ${wipeout.toFixed(0)}% takes your own money to zero. The broker sells before that, at the worst price, and does not ask. This is how hundreds of thousands were finished in 2010.`),
        },
      };
    },
  },

  {
    id: "break-even",
    title: S("সমান হতে কত দাম", "The price you break even at"),
    inputs: [
      inp("buy", "কেনার দাম", "Buy price", 5, 1000, 1, 50, "taka"),
      inp("commission", "কমিশন প্রতি দিকে", "Commission each way", 0.1, 1.5, 0.05, 0.4, "pct"),
      inp("tax", "বিক্রিতে উৎসে কর", "Tax at sale", 0, 1, 0.05, 0.05, "pct"),
    ],
    run: (v) => {
      const cost = v.buy * (1 + v.commission / 100);
      const need = cost / (1 - (v.commission + v.tax) / 100);
      const move = ((need - v.buy) / v.buy) * 100;
      return {
        outs: [
          out("সমান হতে দাম", "Break-even price", need, "taka", { big: true }),
          out("কত শতাংশ উঠতে হবে", "Rise needed", move, "pct", { tone: move > 2 ? "warn" : "plain" }),
        ],
        verdict: {
          tone: "plain",
          text: S(`কেনার সঙ্গে সঙ্গে আপনি ${bnNum(move.toFixed(2))}% পেছনে। লাভ শুরু হয় এই দাগ পেরোনোর পর, আর দিনে দিনে কেনাবেচা করলে এই দাগটা প্রতিবার নতুন করে পেরোতে হয়।`,
                `The moment you buy you are ${move.toFixed(2)}% behind. Profit starts past that line, and trading in and out means crossing it again every single time.`),
        },
      };
    },
  },

  {
    id: "position-size",
    title: S("এক শেয়ারে কত টাকা", "How much in one share"),
    inputs: [
      inp("capital", "মোট পুঁজি", "Total capital", 10000, 5000000, 10000, 300000, "taka"),
      inp("risk", "একটা ভুলে সর্বোচ্চ কত হারাবেন", "Most you will lose on one mistake", 0.5, 10, 0.5, 2, "pct"),
      inp("entry", "কেনার দাম", "Entry price", 5, 1000, 1, 60, "taka"),
      inp("stop", "যে দামে ভুল মেনে বেরোবেন", "Price at which you admit you are wrong", 1, 990, 1, 48, "taka"),
    ],
    run: (v) => {
      const perShare = Math.max(0.01, v.entry - v.stop);
      const budget = v.capital * (v.risk / 100);
      const shares = Math.floor(budget / perShare);
      const spend = shares * v.entry;
      const weight = (spend / v.capital) * 100;
      return {
        outs: [
          out("কতটা শেয়ার", "Shares to buy", shares, "num", { big: true }),
          out("খরচ হবে", "That costs", spend, "taka"),
          out("পোর্টফোলিওর কত অংশ", "Share of the portfolio", weight, "pct",
            { tone: weight > 25 ? "bad" : weight > 15 ? "warn" : "good" }),
        ],
        verdict: {
          tone: v.stop >= v.entry ? "bad" : weight > 25 ? "warn" : "plain",
          text: v.stop >= v.entry
            ? S("বেরোনোর দাম কেনার দামের চেয়ে বেশি রাখলে অঙ্কটা কাজ করে না। ভুল মানার দামটা কেনার দামের নিচে হতে হয়, আর সেটা কেনার আগে ঠিক করতে হয়।",
                "An exit above the entry does not compute. The price at which you admit you are wrong sits below where you bought, and it is chosen before you buy.")
            : S(`শেয়ারপ্রতি ঝুঁকি ${bnNum(perShare.toFixed(2))} টাকা, তাই ${bnNum(shares)}টার বেশি কিনলে আপনার নিজের নিয়ম ভাঙা হয়। কত টাকা আছে তা দিয়ে না, কত হারাতে রাজি তা দিয়ে পরিমাণ ঠিক করা: এই একটা অভ্যাস বেশিরভাগ মানুষকে বাজারে টিকিয়ে রাখে।`,
                `Risk per share is ${perShare.toFixed(2)} taka, so more than ${shares} shares breaks your own rule. Sizing by what you can lose rather than by what you have is the one habit that keeps most people in the market.`),
        },
      };
    },
  },

  {
    id: "bond",
    title: S("বন্ডের রিটার্ন", "What a bond returns"),
    inputs: [
      inp("face", "অভিহিত মূল্য", "Face value", 100, 10000, 100, 1000, "taka"),
      inp("coupon", "কুপন হার", "Coupon rate", 0, 15, 0.25, 8, "pct"),
      inp("price", "বাজারদর", "Market price", 50, 12000, 10, 950, "taka"),
      inp("years", "মেয়াদ বাকি", "Years to maturity", 1, 20, 1, 5, "year"),
    ],
    run: (v) => {
      const coupon = v.face * (v.coupon / 100);
      const current = (coupon / Math.max(1, v.price)) * 100;
      const ytm = ((coupon + (v.face - v.price) / Math.max(1, v.years)) / ((v.face + v.price) / 2)) * 100;
      return {
        outs: [
          out("বছরে কুপন", "Coupon a year", coupon, "taka"),
          out("চলতি ইল্ড", "Current yield", current, "pct"),
          out("মেয়াদ পর্যন্ত ইল্ড", "Yield to maturity", ytm, "pct", { big: true }),
        ],
        verdict: {
          tone: "plain",
          text: v.price < v.face
            ? S(`অভিহিত মূল্যের নিচে কিনলে কুপনের বাইরেও মেয়াদ শেষে ${bnNum((v.face - v.price).toFixed(0))} টাকা ফেরত আসে, তাই মোট ইল্ড কুপনের চেয়ে বেশি। বন্ডের দাম আর ইল্ড উল্টো দিকে চলে, সবসময়।`,
                `Bought below face, you also get ${(v.face - v.price).toFixed(0)} taka back at maturity, so the total yield beats the coupon. Bond prices and yields move in opposite directions, always.`)
            : S(`অভিহিত মূল্যের ওপরে কিনলে মেয়াদ শেষে কম ফেরত আসে, তাই আসল ইল্ড কুপনের চেয়ে কম। কুপনের সংখ্যাটা বিজ্ঞাপন, মেয়াদ পর্যন্ত ইল্ডটা সত্য।`,
                `Bought above face, less comes back at maturity, so the real yield is below the coupon. The coupon is the advertisement; yield to maturity is the truth.`),
        },
      };
    },
  },

  {
    id: "ipo",
    title: S("আইপিওতে কতটা পাবেন", "What an IPO actually gives you"),
    inputs: [
      inp("offer", "মোট ইস্যু (কোটি টাকা)", "Total issue (crore taka)", 5, 500, 5, 50, "num"),
      inp("applications", "কত আবেদন (লাখ)", "Applications (lakh)", 1, 60, 1, 12, "num"),
      inp("each", "প্রতি আবেদনে", "Per application", 5000, 20000, 1000, 10000, "taka"),
      inp("pop", "তালিকাভুক্তির দিনে দাম বাড়ল", "First-day rise", -30, 200, 5, 60, "pct"),
    ],
    run: (v) => {
      const demanded = v.applications * 100000 * v.each;
      const offered = v.offer * 10000000;
      const odds = clamp((offered / Math.max(1, demanded)) * 100, 0, 100);
      const expected = v.each * (odds / 100);
      const gain = expected * (v.pop / 100);
      return {
        outs: [
          out("পাওয়ার সম্ভাবনা", "Chance of an allotment", odds, "pct", { big: true, tone: odds < 15 ? "bad" : "plain" }),
          out("গড়ে যা পাবেন", "Average allotment", expected, "taka"),
          out("প্রথম দিনে গড় লাভ", "Average first-day gain", gain, "taka", { tone: gain > 0 ? "good" : "bad" }),
        ],
        verdict: {
          tone: odds < 15 ? "warn" : "plain",
          text: S(`চাহিদা জোগানের ${bnNum((demanded / Math.max(1, offered)).toFixed(1))} গুণ, তাই লটারিতে নাম ওঠার সম্ভাবনা ${bnNum(odds.toFixed(1))}%। আইপিও থেকে টাকা বানানোর গল্পগুলো যারা পেয়েছে তাদের; যারা পায়নি তাদের টাকা মাসখানেক আটকে ছিল, ব্যাস।`,
                `Demand is ${(demanded / Math.max(1, offered)).toFixed(1)} times the offer, so the lottery gives you a ${odds.toFixed(1)}% chance. The IPO stories come from the people who got one; the rest had money locked up for a month.`),
        },
      };
    },
  },

  /* ---------- পর্যায় ২ and ৩ ---------- */

  {
    id: "taka",
    title: S("ডলারের দাম বাড়লে কার কী", "When the dollar rises"),
    inputs: [
      inp("sales", "বছরে বিক্রি (কোটি টাকা)", "Yearly sales (crore taka)", 10, 3000, 10, 400, "num"),
      inp("imported", "খরচের কত অংশ আমদানি", "Share of costs imported", 0, 100, 5, 60, "pct"),
      inp("costs", "বিক্রির কত অংশ খরচ", "Costs as a share of sales", 40, 95, 1, 78, "pct"),
      inp("move", "টাকার বিপরীতে ডলার বাড়ল", "Dollar rises against the taka", 0, 40, 1, 10, "pct"),
      inp("exports", "বিক্রির কত অংশ রপ্তানি", "Share of sales exported", 0, 100, 5, 0, "pct"),
    ],
    run: (v) => {
      const costTaka = v.sales * (v.costs / 100);
      const extraCost = costTaka * (v.imported / 100) * (v.move / 100);
      const extraSales = v.sales * (v.exports / 100) * (v.move / 100);
      const before = v.sales - costTaka;
      const after = before + extraSales - extraCost;
      const change = ((after - before) / Math.max(0.01, before)) * 100;
      return {
        outs: [
          out("মুনাফা আগে", "Profit before", before, "num", { note: S("কোটি টাকা", "crore taka") }),
          out("মুনাফা পরে", "Profit after", after, "num", { note: S("কোটি টাকা", "crore taka") }),
          out("বদল", "Change", change, "pct", { big: true, tone: change >= 0 ? "good" : "bad" }),
        ],
        verdict: {
          tone: change >= 0 ? "good" : "bad",
          text: change >= 0
            ? S(`ডলার বাড়লে এই কোম্পানির লাভ বাড়ে। রপ্তানিকারক ডলারে বিক্রি করে আর টাকায় খরচ দেয়, তাই টাকার দাম কমা তার পক্ষে। তৈরি পোশাক খাত এই দিকে থাকে।`,
                `A rising dollar helps this one. An exporter sells in dollars and pays in taka, so a weaker taka is in its favour. Ready-made garments sit on this side.`)
            : S(`ডলার ${bnNum(v.move)}% বাড়লে মুনাফা ${bnNum(Math.abs(change).toFixed(1))}% কমে। যে কোম্পানি কাঁচামাল আমদানি করে টাকায় বেচে, তার জন্য ডলার বাড়া মানে সরাসরি মার্জিনে কোপ। সিমেন্ট, ইস্পাত আর জ্বালানি এই দিকে।`,
                `A ${v.move}% dollar move cuts profit by ${Math.abs(change).toFixed(1)}%. A company that imports its inputs and sells in taka takes the move straight out of its margin. Cement, steel and fuel sit here.`),
        },
      };
    },
  },

  {
    id: "rates",
    title: S("সুদের হার বাড়লে", "When interest rates rise"),
    inputs: [
      inp("rate", "সুদের হার এখন", "Rate now", 4, 16, 0.25, 9, "pct"),
      inp("change", "কত বাড়ল", "It rises by", 0, 6, 0.25, 2, "pct"),
      inp("pe", "শেয়ারের পিই", "The market's P/E", 5, 30, 0.5, 14, "times"),
      inp("debt", "কোম্পানির ঋণ (কোটি টাকা)", "Company's debt (crore taka)", 0, 2000, 10, 300, "num"),
      inp("profit", "মুনাফা (কোটি টাকা)", "Profit (crore taka)", 1, 500, 1, 60, "num"),
    ],
    run: (v) => {
      const before = 100 / v.rate;
      const after = 100 / (v.rate + v.change);
      const fairPe = v.pe * (after / before);
      const extraInterest = v.debt * (v.change / 100);
      const profitHit = (extraInterest / Math.max(0.01, v.profit)) * 100;
      return {
        outs: [
          out("দাঁড়ানোর মতো পিই", "P/E that competes", fairPe, "times", { big: true, tone: "warn" }),
          out("বাড়তি সুদ খরচ", "Extra interest", extraInterest, "num", { note: S("কোটি টাকা", "crore taka") }),
          out("মুনাফায় কোপ", "Profit hit", profitHit, "pct", { tone: profitHit > 20 ? "bad" : "warn" }),
        ],
        verdict: {
          tone: "warn",
          text: S(`সুদ বাড়া দুই দিক থেকে কামড়ায়। এক, ব্যাংকে ঝুঁকিহীন ${bnNum((v.rate + v.change).toFixed(2))}% পাওয়া গেলে শেয়ারের জন্য মানুষ কম দাম দিতে রাজি হয়। দুই, ঋণে চলা কোম্পানির সুদ খরচ বেড়ে মুনাফা ${bnNum(profitHit.toFixed(0))}% কমে। এইজন্যই বাংলাদেশ ব্যাংকের ঘোষণার দিনে বাজার নড়ে।`,
                `Higher rates bite twice. First, a risk-free ${(v.rate + v.change).toFixed(2)}% at the bank means people pay less for shares. Second, a borrower's interest bill rises and takes ${profitHit.toFixed(0)}% off profit. That is why the market moves on a Bangladesh Bank announcement.`),
        },
      };
    },
  },

  {
    id: "cash-vs-profit",
    title: S("লাভ আছে, নগদ কই", "Profit on paper, cash in hand"),
    inputs: [
      inp("profit", "নিট মুনাফা (কোটি টাকা)", "Net profit (crore taka)", 0, 500, 1, 50, "num"),
      inp("depreciation", "অবচয় (কোটি টাকা)", "Depreciation (crore taka)", 0, 200, 1, 15, "num"),
      inp("receivables", "পাওনা বেড়েছে (কোটি টাকা)", "Receivables rose by (crore taka)", -100, 300, 1, 40, "num"),
      inp("inventory", "মজুদ বেড়েছে (কোটি টাকা)", "Inventory rose by (crore taka)", -100, 300, 1, 25, "num"),
      inp("payables", "দেনা বেড়েছে (কোটি টাকা)", "Payables rose by (crore taka)", -100, 300, 1, 10, "num"),
    ],
    run: (v) => {
      const cash = v.profit + v.depreciation - v.receivables - v.inventory + v.payables;
      const quality = (cash / Math.max(0.01, v.profit)) * 100;
      return {
        outs: [
          out("পরিচালন নগদ প্রবাহ", "Operating cash flow", cash, "num",
            { big: true, tone: cash < 0 ? "bad" : quality < 60 ? "warn" : "good", note: S("কোটি টাকা", "crore taka") }),
          out("মুনাফার কত অংশ নগদে এল", "Cash as a share of profit", quality, "pct",
            { tone: quality < 60 ? "bad" : "good" }),
        ],
        chart: {
          shape: "bar",
          labels: ["1", "2", "3", "4", "5", "6"],
          series: [{
            name: S("কোটি টাকা", "crore taka"),
            values: [v.profit, v.depreciation, -v.receivables, -v.inventory, v.payables, cash],
            tone: "lead",
          }],
        },
        verdict: {
          tone: quality < 60 ? "bad" : "good",
          text: quality < 60
            ? S(`মুনাফার মাত্র ${bnNum(quality.toFixed(0))}% নগদে এসেছে। বাকিটা বসে আছে পাওনায় আর মজুদে, অর্থাৎ কোম্পানি বিক্রি দেখাচ্ছে কিন্তু টাকা তুলতে পারছে না। এটা বছরের পর বছর চলতে থাকলে সেটা ভঙ্গির সমস্যা না, হিসাবের সমস্যা।`,
                `Only ${quality.toFixed(0)}% of profit arrived as cash. The rest sits in receivables and stock: sales are booked and the money is not collected. Repeated year after year that is not a timing problem, it is an accounting one.`)
            : S(`মুনাফার ${bnNum(quality.toFixed(0))}% নগদে এসেছে, যা সুস্থ। লাভ একটা মতামত, নগদ একটা ঘটনা: এইজন্যই নগদ প্রবাহের পাতাটা তিনটার মধ্যে সবচেয়ে সৎ।`,
                `${quality.toFixed(0)}% of profit came in as cash, which is healthy. Profit is an opinion and cash is a fact, which is why the cash flow page is the honest one of the three.`),
        },
      };
    },
  },

  {
    id: "debt-cover",
    title: S("ঋণ সামলাতে পারবে তো", "Can it carry its debt"),
    inputs: [
      inp("operating", "পরিচালন মুনাফা (কোটি টাকা)", "Operating profit (crore taka)", 0, 800, 5, 90, "num"),
      inp("interest", "সুদ খরচ (কোটি টাকা)", "Interest bill (crore taka)", 0, 400, 1, 30, "num"),
      inp("debt", "মোট ঋণ (কোটি টাকা)", "Total debt (crore taka)", 0, 3000, 10, 400, "num"),
      inp("equity", "মালিকদের অংশ (কোটি টাকা)", "Equity (crore taka)", 10, 3000, 10, 350, "num"),
    ],
    run: (v) => {
      const cover = v.operating / Math.max(0.01, v.interest);
      const gearing = v.debt / Math.max(0.01, v.equity);
      const payback = v.debt / Math.max(0.01, v.operating);
      return {
        outs: [
          out("সুদ কতবার শোধ হয়", "Interest cover", cover, "times",
            { big: true, tone: cover < 2 ? "bad" : cover < 4 ? "warn" : "good" }),
          out("ঋণ ও মূলধনের অনুপাত", "Debt to equity", gearing, "times", { tone: gearing > 2 ? "bad" : gearing > 1 ? "warn" : "good" }),
          out("সব লাভ দিয়ে ঋণ শোধে", "Years of profit to clear the debt", payback, "year"),
        ],
        verdict: {
          tone: cover < 2 ? "bad" : "plain",
          text: cover < 2
            ? S(`পরিচালন মুনাফা সুদের ${bnNum(cover.toFixed(1))} গুণ মাত্র। একটা খারাপ বছর এলেই সুদ দিতে গিয়ে টান পড়বে। বাংলাদেশে যত কোম্পানি Z ক্যাটাগরিতে নেমেছে, বেশিরভাগের গল্প এই একটা সংখ্যা দিয়ে শুরু।`,
                `Operating profit covers interest just ${cover.toFixed(1)} times. One bad year and paying the interest becomes the whole problem. Most companies that fall into Z category start their story at this number.`)
            : S(`সুদ ${bnNum(cover.toFixed(1))} বার শোধ হয়, যা আরামদায়ক। ঋণ নিজে খারাপ না; সামলাতে না পারা ঋণ খারাপ, আর এই দুইটা সংখ্যা সেই পার্থক্যটা দেখায়।`,
                `Interest is covered ${cover.toFixed(1)} times, which is comfortable. Debt is not bad; unpayable debt is, and these two numbers are the difference.`),
        },
      };
    },
  },

  {
    id: "dca",
    title: S("প্রতি মাসে একই টাকা", "The same amount every month"),
    inputs: [
      inp("monthly", "মাসে", "Each month", 500, 100000, 500, 5000, "taka"),
      inp("start", "শুরুর দাম", "Starting price", 10, 500, 5, 100, "taka"),
      inp("swing", "দাম কত ওঠানামা করে", "How much the price swings", 0, 60, 5, 30, "pct"),
      inp("months", "কত মাস", "For how many months", 6, 60, 1, 24, "month"),
    ],
    run: (v) => {
      /* A fixed zigzag rather than a random walk, so the lesson
         is repeatable: a reader who moves a slider back must get
         the same picture, and a random one would teach that the
         answer depends on luck when the point is that it does
         not. */
      const prices = Array.from({ length: v.months }, (_, m) =>
        v.start * (1 + (v.swing / 100) * Math.sin((m / 5) * Math.PI)));
      let units = 0;
      for (const p of prices) units += v.monthly / p;
      const spent = v.monthly * v.months;
      const average = spent / Math.max(0.0001, units);
      const meanPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const worth = units * prices[prices.length - 1];
      return {
        outs: [
          out("গড়ে যে দামে কিনলেন", "Your average price", average, "taka", { big: true, tone: "good" }),
          out("দামের গড়", "Average of the prices", meanPrice, "taka"),
          out("এখন দাঁড়িয়েছে", "Worth now", worth, "taka", { tone: worth >= spent ? "good" : "bad" }),
        ],
        chart: {
          shape: "line",
          labels: prices.map((_, i) => String(i + 1)),
          series: [
            { name: S("দাম", "Price"), values: prices, tone: "plain" },
            { name: S("আপনার গড়", "Your average"), values: prices.map(() => average), tone: "good" },
          ],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: "good",
          text: S(`আপনার গড় দাম ${bnNum(average.toFixed(2))}, দামগুলোর নিজের গড় ${bnNum(meanPrice.toFixed(2))}। একই টাকা দিলে দাম কম থাকলে বেশি শেয়ার আসে, তাই গড়টা নিজে থেকেই নিচে নামে। কোনো চালাকি না, ভাগের অঙ্ক।`,
                `Your average is ${average.toFixed(2)} against a simple price average of ${meanPrice.toFixed(2)}. A fixed sum buys more units when the price is low, so the average falls on its own. No cleverness, just division.`),
        },
      };
    },
  },

  {
    id: "drawdown",
    title: S("পড়ে যাওয়া থেকে ফেরা", "Getting back from a fall"),
    inputs: [
      inp("fall", "কত পড়ল", "The fall", 5, 90, 5, 40, "pct"),
      inp("rate", "এরপর বছরে রিটার্ন", "Return after that", 2, 25, 1, 12, "pct"),
    ],
    run: (v) => {
      const need = (1 / (1 - v.fall / 100) - 1) * 100;
      const yearsBack = Math.log(1 / (1 - v.fall / 100)) / Math.log(1 + v.rate / 100);
      const falls = [10, 20, 30, 50, 70, 90];
      return {
        outs: [
          out("সমান হতে উঠতে হবে", "Rise needed to get level", need, "pct", { big: true, tone: "bad" }),
          out("সময় লাগবে", "Years to get level", yearsBack, "year", { tone: yearsBack > 5 ? "bad" : "warn" }),
        ],
        chart: {
          shape: "bar",
          labels: falls.map(String),
          series: [{ name: S("ফিরতে দরকার", "Rise needed"), values: falls.map((f) => (1 / (1 - f / 100) - 1) * 100), tone: "bad" }],
          unit: S("শতাংশ", "percent"),
        },
        verdict: {
          tone: "bad",
          text: S(`${bnNum(v.fall)}% পড়া মানে ${bnNum(v.fall)}% ওঠা নয়, ${bnNum(need.toFixed(0))}% ওঠা। ক্ষতি আর লাভের অঙ্ক সমান না, আর এইজন্যই বড় ক্ষতি এড়ানো বড় লাভ খোঁজার চেয়ে দামি।`,
                `A ${v.fall}% fall is undone by a ${need.toFixed(0)}% rise, not a ${v.fall}% one. Losses and gains are not symmetric, which is why avoiding the big loss beats hunting the big gain.`),
        },
      };
    },
  },

  {
    id: "circuit",
    title: S("সার্কিট ব্রেকার", "The circuit breaker"),
    inputs: [
      inp("close", "গতকালের বন্ধ দাম", "Yesterday's close", 5, 2000, 1, 100, "taka"),
      inp("limit", "দৈনিক সীমা", "Daily limit", 2, 20, 0.5, 10, "pct"),
      inp("days", "কত দিন একদিকে গেল", "Days moving one way", 1, 10, 1, 3, "day"),
    ],
    run: (v) => {
      const up = v.close * Math.pow(1 + v.limit / 100, v.days);
      const down = v.close * Math.pow(1 - v.limit / 100, v.days);
      const path = Array.from({ length: v.days + 1 }, (_, d) => v.close * Math.pow(1 - v.limit / 100, d));
      return {
        outs: [
          out("সর্বোচ্চ যেতে পারে", "Ceiling after those days", up, "taka", { tone: "good" }),
          out("সর্বনিম্ন যেতে পারে", "Floor after those days", down, "taka", { tone: "bad", big: true }),
          out("মোট পতন", "Total fall", (1 - down / v.close) * 100, "pct", { tone: "bad" }),
        ],
        chart: {
          shape: "line",
          labels: Array.from({ length: v.days + 1 }, (_, i) => String(i)),
          series: [{ name: S("দাম", "Price"), values: path, tone: "bad" }],
          unit: S("টাকা", "taka"),
        },
        verdict: {
          tone: "warn",
          text: S(`সীমা দাম আটকায়, বিপদ আটকায় না। টানা ${bnNum(v.days)} দিন নিচের সীমায় বসে থাকলে দাম ${bnNum(((1 - down / v.close) * 100).toFixed(0))}% পড়ে যায়, আর সেই দিনগুলোতে ক্রেতা না থাকায় আপনি বেচতেও পারেন না। সীমা আপনাকে বাঁচায় না, ধীরে নামায়।`,
                `A limit caps the price, not the damage. ${v.days} days stuck on the floor is a ${((1 - down / v.close) * 100).toFixed(0)}% fall, and on those days there are no buyers, so you cannot sell either. The limit does not save you, it slows you down.`),
        },
      };
    },
  },

  {
    id: "peers",
    title: S("পাশাপাশি রেখে দেখা", "Side by side"),
    inputs: [
      inp("pe", "আপনার কোম্পানির পিই", "Your company's P/E", 2, 40, 0.5, 12, "times"),
      inp("peerPe", "খাতের গড় পিই", "Sector average P/E", 2, 40, 0.5, 16, "times"),
      inp("roe", "আপনার কোম্পানির আরওই", "Your company's ROE", 0, 40, 1, 18, "pct"),
      inp("peerRoe", "খাতের গড় আরওই", "Sector average ROE", 0, 40, 1, 12, "pct"),
      inp("eps", "ইপিএস", "Earnings per share", 0.5, 60, 0.25, 5, "taka"),
    ],
    run: (v) => {
      const discount = ((v.pe - v.peerPe) / Math.max(0.01, v.peerPe)) * 100;
      const atPeer = v.eps * v.peerPe;
      const quality = v.roe - v.peerRoe;
      return {
        outs: [
          out("খাতের তুলনায় দাম", "Priced against the sector", discount, "pct",
            { big: true, tone: discount < 0 ? "good" : "warn" }),
          out("খাতের পিইতে দাম হতো", "At the sector's P/E the price is", atPeer, "taka"),
          out("আরওইতে এগিয়ে", "ROE advantage", quality, "pct", { tone: quality > 0 ? "good" : "bad" }),
        ],
        verdict: {
          tone: discount < 0 && quality > 0 ? "good" : discount > 0 && quality < 0 ? "bad" : "warn",
          text: discount < 0 && quality > 0
            ? S("খাতের চেয়ে ভালো ব্যবসা, খাতের চেয়ে কম দাম। এই দুইটা একসাথে মিললে হয় বাজার কিছু জানে যা আপনি জানেন না, নয়তো আপনি কিছু দেখেছেন যা এখনো দামে ঢোকেনি। কোনটা, সেটা খুঁজে বের করাই বাকি কাজ।",
                "A better business than the sector, priced below it. When those two meet, either the market knows something you do not, or you have seen something the price has not. Finding out which is the rest of the work.")
            : S("তুলনা কেবল একই খাতের ভেতরে অর্থবহ। ব্যাংকের পিই ওষুধ কোম্পানির পিইয়ের সঙ্গে মেলানো মানে কমলার সঙ্গে আম মেলানো, আর দুইটাই দেখতে গোল।",
                "Comparison only means anything inside a sector. Holding a bank's P/E next to a pharma's is holding an orange against a mango, and both are round."),
        },
      };
    },
  },

  {
    id: "tax",
    title: S("কর কেটে কত থাকে", "What is left after tax"),
    inputs: [
      inp("dividend", "নগদ ডিভিডেন্ড", "Cash dividend", 0, 500000, 1000, 20000, "taka"),
      inp("dividendTax", "ডিভিডেন্ডে উৎসে কর", "Tax withheld on dividend", 0, 30, 1, 10, "pct"),
      inp("gain", "শেয়ার বেচে লাভ", "Gain on selling shares", 0, 2000000, 5000, 100000, "taka"),
      inp("gainTax", "মূলধনি লাভে কর", "Tax on the gain", 0, 30, 1, 0, "pct"),
    ],
    run: (v) => {
      const netDiv = v.dividend * (1 - v.dividendTax / 100);
      const netGain = v.gain * (1 - v.gainTax / 100);
      const paid = (v.dividend - netDiv) + (v.gain - netGain);
      return {
        outs: [
          out("হাতে থাকল", "You keep", netDiv + netGain, "taka", { big: true, tone: "good" }),
          out("কর গেল", "Tax paid", paid, "taka", { tone: "bad" }),
          out("কার্যকর কর হার", "Effective rate", ((paid / Math.max(1, v.dividend + v.gain)) * 100), "pct"),
        ],
        verdict: {
          tone: "warn",
          text: S("হার বদলায় এবং বাজেটে বদলাতে পারে, তাই এই স্লাইডারগুলো নিজেই সরিয়ে দেখুন, আর সিদ্ধান্তের আগে চলতি বছরের হারটা এনবিআরের সাইট থেকে মিলিয়ে নিন। এখানে শেখার জিনিসটা হার না: রিটার্ন সবসময় কর কাটার পরের সংখ্যাটা।",
                "The rates change and a budget can change them, so move these sliders yourself and check this year's numbers on the NBR site before deciding anything. The lesson here is not the rate: a return is always the number after tax."),
        },
      };
    },
  },

  /* ---------- THE TWO CURVES THAT CROSS ----------

     The first model here that plots two lines against each other
     rather than one thing over time, and the reason it is worth
     the extra shape is that a price is not a number somebody
     sets: it is where two willingnesses meet.

     The x axis is PRICE and the two series are quantities, which
     is the transpose of how an economics textbook draws it. That
     is deliberate: a textbook puts price up the side because it
     is drawing a mathematical relation, and a reader who has
     never seen one reads a chart left to right. Turning it costs
     nothing and the crossing is the same crossing.

     The clearing price is solved rather than drawn: `run` walks
     the price axis and reports where the gap changes sign, so the
     number under the chart is the answer to the chart rather than
     a second calculation that could disagree with it. */
  {
    id: "supply-demand",
    title: S("দাম কোথায় গিয়ে থামে", "Where the price settles"),
    inputs: [
      inp("want", "মানুষ কতটা চায়", "How much people want", 20, 300, 10, 180, "num",
        S("দাম শূন্য হলে যতটা বিক্রি হতো।", "What would sell if it were free.")),
      inp("sensitivity", "দাম বাড়লে চাহিদা কত কমে", "How fast wanting falls with price",
        1, 20, 1, 4, "num",
        S("বেশি হলে সামান্য দাম বাড়লেই মানুষ সরে যায়।",
          "High means a small rise sends people away.")),
      inp("cost", "যে দামের নিচে কেউ বানাবে না", "The price below which nobody makes it",
        0, 40, 1, 10, "taka"),
      /* THE DEFAULTS PUT THE CROSSING IN THE MIDDLE OF THE AXIS,
         which is not decoration: the first set had it at 12 taka
         on an axis running to 60, so the lesson opened on a chart
         whose whole point was crammed into the left fifth of it
         and whose right two thirds were two flat lines. */
      inp("supply", "দাম বাড়লে কত বেশি বানায়", "How fast making it rises with price",
        1, 20, 1, 4, "num"),
    ],
    run: (v) => {
      /* Two straight lines, because a lesson about a crossing is
         not helped by a curve nobody can read off. Demand falls
         from `want` at the rate `sensitivity`; supply is nought
         until `cost` and then rises at `supply`. */
      const prices = Array.from({ length: 13 }, (_, i) => i * 5);
      const demand = prices.map((p) => Math.max(0, v.want - v.sensitivity * p));
      const supply = prices.map((p) => Math.max(0, (p - v.cost) * v.supply));

      /* Where the gap changes sign, interpolated between the two
         prices either side of it, which is the crossing itself
         rather than the nearest point this chart happens to have
         drawn. */
      let clearing = 0;
      let traded = 0;
      for (let i = 1; i < prices.length; i += 1) {
        const was = demand[i - 1] - supply[i - 1];
        const now = demand[i] - supply[i];
        if (was >= 0 && now < 0) {
          const t = was / (was - now);
          clearing = prices[i - 1] + t * (prices[i] - prices[i - 1]);
          traded = demand[i - 1] + t * (demand[i] - demand[i - 1]);
          break;
        }
      }

      /* NO MARKET IS A QUANTITY OF NOUGHT, not a price of nought.
         The first test here asked whether the crossing price was
         zero, and the case it was written for reports a price of
         40 with nothing changing hands: wanting runs out at 2
         taka, nobody makes it below 40, and the two lines meet
         where both are on the floor. A price with no trade behind
         it is not a price. */
      const never = traded < 0.5;
      return {
        outs: [
          out("যে দামে বাজার থামে", "The price it settles at", clearing, "taka",
            { big: true, tone: never ? "bad" : "good" }),
          out("সেই দামে কত বিক্রি হয়", "How much changes hands at that price",
            traded, "num"),
          out("বানানোর সর্বনিম্ন দাম", "The floor under the price", v.cost, "taka"),
        ],
        chart: {
          shape: "line",
          labels: prices.map(String),
          series: [
            { name: S("যতটা কিনতে চায়", "What people will buy"), values: demand, tone: "good" },
            { name: S("যতটা বানাতে চায়", "What sellers will make"), values: supply, tone: "warn" },
          ],
          unit: S("দাম, টাকা", "Price, taka"),
        },
        verdict: never
          ? {
            tone: "bad",
            text: S("এই দামে কেউ বানাতে রাজি নয় এমন জায়গায় চাহিদা শেষ হয়ে যাচ্ছে: বাজারটাই তৈরি হয় না। এটাই বহু ভালো আইডিয়া ব্যবসা না হওয়ার কারণ।",
              "Wanting runs out below the price at which anybody is willing to make it, so no market forms at all. That is why many good ideas are not businesses."),
          }
          : clearing < v.cost * 1.2
            ? {
              tone: "warn",
              text: S("দাম খরচের ঠিক উপরে থামছে। বিক্রেতার হাতে প্রায় কিছুই থাকছে না, আর একটু খরচ বাড়লেই ব্যবসাটা বন্ধ।",
                "The price settles barely above cost. There is almost nothing in it for the seller, and a small rise in costs closes the business."),
            }
            : {
              tone: "good",
              text: S("দুই দিকের ইচ্ছা যেখানে মেলে, দাম সেখানেই থামে। কেউ দামটা ঠিক করে দেয়নি: স্লাইডার সরিয়ে দেখুন, দাম নিজেই সরে যায়।",
                "The price settles where the two willingnesses meet. Nobody set it: move a slider and watch it move on its own."),
            },
      };
    },
  },

  /* ---------- what one late payment costs, over and over ---------- */
  {
    id: "late-fee",
    title: S("দেরিতে দিলে কী হয়", "What paying late actually costs"),
    inputs: [
      inp("bill", "বিলের অঙ্ক", "The bill", 500, 100000, 500, 12000, "taka"),
      inp("fee", "দেরির জরিমানা", "Late fee", 0, 20, 0.5, 2.5, "pct"),
      inp("times", "বছরে কতবার দেরি হয়", "Times a year it happens", 0, 12, 1, 3, "times"),
      inp("years", "কত বছর ধরে", "For how many years", 1, 20, 1, 5, "year"),
    ],
    run: (v) => {
      const once = v.bill * (v.fee / 100);
      const year = once * v.times;
      const total = year * v.years;
      /* What that money would have been, at a rate a savings
         product here actually pays, so the cost is stated as
         something forgone rather than as a scary total. */
      const kept = grow(0, year / 12, 8, v.years);
      return {
        outs: [
          out("একবারে", "Each time", once, "taka"),
          out("বছরে", "Every year", year, "taka", { tone: "warn" }),
          out("এই বছরগুলোয় মোট", "Over those years", total, "taka",
            { big: true, tone: "bad" }),
          out("সেই টাকা রাখলে হতো", "Saved instead, it would be",
            kept[kept.length - 1], "taka", { tone: "good" }),
        ],
        chart: {
          shape: "bar",
          labels: years(v.years),
          series: [{ name: S("জমা জরিমানা", "Fees paid, running total"),
            values: Array.from({ length: v.years + 1 }, (_, i) => year * i), tone: "bad" }],
          unit: S("টাকা", "Taka"),
        },
        verdict: {
          tone: total > v.bill ? "bad" : "warn",
          text: total > v.bill
            ? S("জরিমানাগুলো মিলে একটা গোটা বিলের চেয়ে বেশি হয়ে গেছে। এটা কোনো বড় সিদ্ধান্তের ফল নয়: শুধু তারিখ মনে না থাকার ফল।",
                "The fees now add up to more than one whole bill. None of that came from a big decision: it came from not remembering a date.")
            : S("অঙ্কটা ছোট দেখাচ্ছে, কিন্তু এটা এমন খরচ যার বিনিময়ে আপনি কিছুই পাননি। একটা রিমাইন্ডারই যথেষ্ট।",
                "The number looks small, and it is money spent on nothing at all. One reminder is the whole fix."),
        },
      };
    },
  },
];

/* ------------------------------------------------------------
   The register
   ------------------------------------------------------------ */

export const LABS: Record<string, LabModel> = Object.fromEntries(
  MODELS.map((m) => [m.id, m])
);

export const LAB_IDS: readonly string[] = MODELS.map((m) => m.id);

/** The values a lab opens at: the model's defaults, with the
    block's presets over the top. A preset naming an input the
    model does not have is dropped rather than passed through, so
    a typo in a row cannot reach the arithmetic. */
export const labDefaults = (
  model: LabModel, preset: Record<string, number> = {}
): Record<string, number> => {
  const values: Record<string, number> = {};
  for (const input of model.inputs) {
    const given = preset[input.id];
    values[input.id] = typeof given === "number" && Number.isFinite(given)
      ? clamp(given, input.min, input.max)
      : input.value;
  }
  return values;
};

export { pair as labSay };
