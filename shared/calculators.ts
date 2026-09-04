/* ============================================================
   calculators.ts: the five calculators' arithmetic. Three
   runtimes agree about it: the browser draws it, `scripts/`
   freezes it into a fixture, and the Android app's Kotlin port is
   asserted against that fixture.

   NOTHING HERE IS PROSE AND NOTHING HERE IS A FORMAT. A
   calculator returns NUMBERS BY NAME and the KEY of the sentence
   to print; both sides look that up in `tool-strings.ts` and fill
   its `{placeholders}` the way `FORMATS` below says. The
   alternative is every sentence written twice, in TypeScript and
   in Kotlin, with no check able to see them part company.

   A CALCULATOR MAY NOT THROW or return NaN without meaning it.
   The fallbacks below are the browser's own `Number(v.x) || 0`
   written out: a missing amount is nought and a missing term is
   ONE YEAR, because nought divides by zero three lines later.
   ============================================================ */

/** How a named number is printed, wherever it appears. ONE TABLE
    rather than a format per call site, so `{growth}` in a
    sentence and the figure above it cannot disagree about whether
    it is money. */
export type Kind = "money" | "percent" | "count" | "years" | "price";

export const FORMATS: Record<string, Kind> = {
  /* compounding */
  final: "money", paid: "money", growth: "money", growthPct: "percent",
  doubles: "count",

  /* sanchayapatra vs FDR */
  sGross: "money", sPaidTax: "money", sNet: "money", sTotal: "money",
  fGross: "money", fPaidTax: "money", fNet: "money", fTotal: "money",
  gap: "money", gapPct: "percent",

  /* inflation */
  worth: "money", lost: "money", lostPct: "percent", real: "percent",
  grown: "money", grownReal: "money",

  /* EMI */
  emi: "money", interest: "money", total: "money", interestPct: "percent",
  shorterEmi: "money", saved: "money", shorter: "years",

  /* position sizing */
  shares: "count", cost: "money", riskTaka: "money", exposure: "percent",
  after20: "money",

  /* inputs, which sentences quote back */
  amount: "money", years: "years", rate: "percent", nominal: "percent",
  inflation: "percent", principal: "money", capital: "money",
  risk: "percent", entry: "price", stop: "price",
  srate: "percent", frate: "percent",
};

/** One thing a reader can change. `kind` drives how the live
    value beside the slider is printed, and it is the same table
    above. */
export interface Field {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  /** A plain number box rather than a slider. Two of the
      twenty-one are: an entry price and a stop are typed off a
      broker's screen, not felt for. */
  typed?: boolean;
}

export interface Outcome {
  /** Every number this calculator produced, by name. The figures
      and every `{placeholder}` in its sentence are looked up
      here, so a name that reaches neither is dead. */
  values: Record<string, number>;
  /** What the chart draws. Empty for a calculator that has none. */
  series: Record<string, number[]>;
  /** The line UNDER each figure, as a phrase key. Chosen by the
      calculator rather than fixed beside the label, because three
      of them turn on the answer, and that branch belongs in the
      model rather than in two renderers. */
  notes: Record<string, string>;
  /** Which sentence to print, under `calc.<id>.<verdict>`. */
  verdict: string;
}

export interface Calculator {
  id: string;
  fields: Field[];
  /** The three headline figures, in the order they are shown.
      Each names a value above and a phrase key beneath it:
      `calc.<id>.<key>` is the label, `.note` the line under. */
  figures: string[];
  /** What the two chart series are called, in drawing order.
      Empty where a calculator draws bars from figures instead. */
  lines: string[];
  run(v: Record<string, number>): Outcome;
}

/* ---------- the browser's own coercions, written out ----------

   `Number(v.start) || 0` turns an absent field, an empty box and
   a nonsense string all into nought, which is wanted. The `|| 1`
   form matters more: a term of nought divides by zero three lines
   later, so a missing one is a year. */
const n = (v: Record<string, number>, key: string, fallback = 0): number => {
  const x = v[key];
  return Number.isFinite(x) && x !== 0 ? x : fallback;
};

/** A rate typed as a percentage, as a fraction. Never falls back
    to anything: nought per cent is a real answer and every
    calculator here has a branch for it. */
const asRate = (v: Record<string, number>, key: string): number => {
  const x = v[key];
  return (Number.isFinite(x) ? x : 0) / 100;
};

/* ============================================================
   1. COMPOUNDING, what a monthly habit becomes
   ============================================================ */

export const compounding: Calculator = {
  id: "compounding",
  fields: [
    { name: "start", min: 0, max: 1_000_000, step: 5000, value: 50_000 },
    { name: "monthly", min: 0, max: 100_000, step: 500, value: 5000 },
    { name: "rate", min: 0, max: 25, step: 0.5, value: 10 },
    { name: "years", min: 1, max: 40, step: 1, value: 20 },
  ],
  figures: ["final", "paid", "growth"],
  lines: ["totals", "contributed"],

  run(v) {
    const start = n(v, "start");
    const monthly = n(v, "monthly");
    const rate = asRate(v, "rate");
    const years = n(v, "years", 1);
    const r = rate / 12;

    const totals: number[] = [];
    const contributed: number[] = [];
    let balance = start;
    let paidIn = start;
    /* Month by month rather than by formula, and deliberately:
       the formula for a growing annuity is right and unreadable,
       and this loop is the thing the page is trying to teach. */
    for (let m = 0; m <= years * 12; m++) {
      if (m > 0) {
        balance = balance * (1 + r) + monthly;
        paidIn += monthly;
      }
      if (m % 12 === 0) {
        totals.push(balance);
        contributed.push(paidIn);
      }
    }

    const growth = balance - paidIn;
    return {
      values: {
        final: balance,
        paid: paidIn,
        growth,
        growthPct: paidIn > 0 ? (growth / paidIn) * 100 : 0,
        /* The rule of 72, which is an approximation and is said
           to be one in the sentence that prints it. */
        doubles: rate > 0 ? 72 / (rate * 100) : Infinity,
        rate: rate * 100,
        years,
      },
      series: { totals, contributed },
      notes: {
        final: "calc.compounding.final.note",
        paid: "calc.compounding.paid.note",
        /* Nothing was put in, so "0% on top" would be a division
           dressed up as a finding. */
        growth: paidIn > 0 ? "calc.compounding.growth.note" : "",
      },
      verdict: rate > 0 ? "grows" : "flat",
    };
  },
};

/* ============================================================
   2. SANCHAYAPATRA vs FDR. The difference is not the headline
   rate: sanchayapatra pays its profit OUT so nothing compounds,
   while an FDR's interest rolls up.
   ============================================================ */

export const sanchayapatra: Calculator = {
  id: "sanchayapatra",
  fields: [
    { name: "amount", min: 50_000, max: 5_000_000, step: 50_000, value: 1_000_000 },
    { name: "years", min: 1, max: 10, step: 1, value: 5 },
    { name: "srate", min: 5, max: 15, step: 0.01, value: 11.04 },
    { name: "stax", min: 0, max: 20, step: 1, value: 10 },
    { name: "frate", min: 3, max: 15, step: 0.01, value: 9 },
    { name: "ftax", min: 0, max: 20, step: 1, value: 10 },
  ],
  figures: ["sTotal", "fTotal", "gap"],
  lines: [],

  run(v) {
    const amount = n(v, "amount");
    const years = n(v, "years", 1);
    const sRate = asRate(v, "srate");
    const fRate = asRate(v, "frate");
    const sTax = asRate(v, "stax");
    const fTax = asRate(v, "ftax");

    /* Sanchayapatra: profit paid out, typically quarterly, and
       taxed at source. Nothing compounds. */
    const sGross = amount * sRate * years;
    const sNet = sGross * (1 - sTax);
    /* FDR: interest compounds, and tax comes off the interest. */
    const fGross = amount * ((1 + fRate) ** years - 1);
    const fNet = fGross * (1 - fTax);

    const sTotal = amount + sNet;
    const fTotal = amount + fNet;
    const gap = Math.abs(sTotal - fTotal);

    return {
      values: {
        sGross, sPaidTax: sGross - sNet, sNet, sTotal,
        fGross, fPaidTax: fGross - fNet, fNet, fTotal,
        gap,
        gapPct: amount > 0 ? (gap / amount) * 100 : 0,
        amount, years,
      },
      series: {},
      notes: {
        sTotal: "calc.sanchayapatra.sTotal.note",
        fTotal: "calc.sanchayapatra.fTotal.note",
        gap: sTotal >= fTotal
          ? "calc.sanchayapatra.gap.note.s"
          : "calc.sanchayapatra.gap.note.f",
      },
      /* Half a per cent of the principal apart over five years is
         not a difference anybody should choose on. The rules are:
         the purchase ceiling, and how fast the money comes out. */
      verdict: gap < amount * 0.005 ? "close" : sTotal >= fTotal ? "sanchayapatra" : "fdr",
    };
  },
};

/* ============================================================
   3. INFLATION, what money is really worth later
   ============================================================ */

export const inflation: Calculator = {
  id: "inflation",
  fields: [
    { name: "amount", min: 10_000, max: 10_000_000, step: 10_000, value: 500_000 },
    { name: "inflation", min: 0, max: 20, step: 0.25, value: 9 },
    { name: "nominal", min: 0, max: 25, step: 0.25, value: 9 },
    { name: "years", min: 1, max: 30, step: 1, value: 10 },
  ],
  figures: ["worth", "lost", "real"],
  lines: ["nominalSeries", "realSeries"],

  run(v) {
    const amount = n(v, "amount");
    const inf = asRate(v, "inflation");
    const years = n(v, "years", 1);
    const nominal = asRate(v, "nominal");

    const worth = amount / (1 + inf) ** years;
    const lost = amount - worth;
    /* Fisher, rather than subtraction: at 15 against 10 the two
       methods differ by half a point. */
    const real = (1 + nominal) / (1 + inf) - 1;
    const grown = amount * (1 + nominal) ** years;
    const grownReal = grown / (1 + inf) ** years;

    const nominalSeries: number[] = [];
    const realSeries: number[] = [];
    for (let y = 0; y <= years; y++) {
      nominalSeries.push(amount * (1 + nominal) ** y);
      realSeries.push((amount * (1 + nominal) ** y) / (1 + inf) ** y);
    }

    return {
      values: {
        worth, lost,
        lostPct: amount > 0 ? (lost / amount) * 100 : 0,
        real: real * 100,
        grown, grownReal,
        amount, years,
        nominal: nominal * 100,
        inflation: inf * 100,
      },
      series: { nominalSeries, realSeries },
      notes: {
        worth: "calc.inflation.worth.note",
        lost: "calc.inflation.lost.note",
        real: real >= 0 ? "calc.inflation.real.note" : "calc.inflation.real.note.losing",
      },
      verdict: real >= 0 ? "beats" : "loses",
    };
  },
};

/* ============================================================
   4. LOAN EMI
   ============================================================ */

export const emi: Calculator = {
  id: "emi",
  fields: [
    { name: "principal", min: 50_000, max: 10_000_000, step: 50_000, value: 1_500_000 },
    { name: "rate", min: 4, max: 20, step: 0.25, value: 12 },
    { name: "years", min: 1, max: 25, step: 1, value: 10 },
  ],
  figures: ["emi", "interest", "total"],
  lines: ["balances", "paidInterest"],

  run(v) {
    const principal = n(v, "principal");
    const rate = asRate(v, "rate") / 12;
    const years = n(v, "years", 1);
    const months = years * 12;

    const instalment = (p: number, r: number, m: number): number =>
      r > 0 ? (p * r * (1 + r) ** m) / ((1 + r) ** m - 1) : p / m;

    const monthly = instalment(principal, rate, months);
    const total = monthly * months;
    const interest = total - principal;

    /* How the balance falls, and how much of what has been paid
       was interest. The two crossing is the whole lesson. */
    const balances: number[] = [];
    const paidInterest: number[] = [];
    let bal = principal;
    let cumInterest = 0;
    for (let m = 0; m <= months; m++) {
      if (m > 0) {
        const i = bal * rate;
        cumInterest += i;
        bal = Math.max(0, bal - (monthly - i));
      }
      if (m % 12 === 0 || m === months) {
        balances.push(bal);
        paidInterest.push(cumInterest);
      }
    }

    /* And what two years off the term would save, which is the
       one lever most borrowers have and the one they are never
       shown a number for. */
    const shorter = Math.max(1, years - 2);
    const shorterMonths = shorter * 12;
    const shorterEmi = instalment(principal, rate, shorterMonths);
    /* THE BRACKETS ARE LOAD-BEARING: `emi * shorter * 12`
       associates left and lands one bit away on a
       ten-million-taka loan, and the Kotlin port is compared to
       this by value. */
    const saved = total - shorterEmi * shorterMonths;

    return {
      values: {
        emi: monthly, interest, total,
        interestPct: principal > 0 ? (interest / principal) * 100 : 0,
        shorter, shorterEmi, saved,
        principal, years,
        rate: asRate(v, "rate") * 100,
      },
      series: { balances, paidInterest },
      notes: {
        emi: "calc.emi.emi.note",
        interest: principal > 0 ? "calc.emi.interest.note" : "",
        total: "calc.emi.total.note",
      },
      verdict: saved > 0 ? "shorter" : "plain",
    };
  },
};

/* ============================================================
   5. POSITION SIZING. The only one here that can tell somebody
   not to take a trade.
   ============================================================ */

export const position: Calculator = {
  id: "position",
  fields: [
    { name: "capital", min: 10_000, max: 5_000_000, step: 10_000, value: 200_000 },
    { name: "risk", min: 0.25, max: 5, step: 0.25, value: 1 },
    { name: "entry", min: 1, max: 5000, step: 0.1, value: 45, typed: true },
    { name: "stop", min: 0, max: 5000, step: 0.1, value: 40, typed: true },
  ],
  figures: ["shares", "cost", "riskTaka"],
  lines: [],

  run(v) {
    const capital = n(v, "capital");
    const riskPct = asRate(v, "risk");
    const entry = n(v, "entry");
    const stop = n(v, "stop");

    const riskTaka = capital * riskPct;
    const perShare = Math.max(0, entry - stop);
    /* Floor, never round: one share more than the rule allows is
       a rule that has stopped being one. */
    const shares = perShare > 0 ? Math.floor(riskTaka / perShare) : 0;
    const cost = shares * entry;

    return {
      values: {
        shares, cost, riskTaka,
        exposure: capital > 0 ? (cost / capital) * 100 : 0,
        /* Twenty losses in a row at this size, which is the
           number that makes a risk rule feel like one. */
        after20: capital * (1 - riskPct) ** 20,
        capital, entry, stop,
        risk: riskPct * 100,
      },
      series: {},
      notes: {
        shares: "calc.position.shares.note",
        cost: cost > capital
          ? "calc.position.cost.note.over"
          : "calc.position.cost.note",
        riskTaka: "calc.position.riskTaka.note",
      },
      verdict: perShare <= 0 ? "noStop" : cost > capital ? "tooBig" : "fits",
    };
  },
};

/** The five, in the order the page shows them, which is
    `TOOLS` in `content.ts`. `check-content.ts` is what stops
    those two lists parting company. */
export const CALCULATORS: Calculator[] = [
  compounding, sanchayapatra, inflation, emi, position,
];

export const calculatorFor = (id: string): Calculator | undefined =>
  CALCULATORS.find((c) => c.id === id);

/** The defaults a calculator opens with, as a plain record. */
export const defaultsFor = (c: Calculator): Record<string, number> =>
  Object.fromEntries(c.fields.map((f) => [f.name, f.value]));
