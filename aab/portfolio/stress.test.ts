#!/usr/bin/env node
/* ============================================================
   stress.test.ts, checks on the credit stress-testing engine.

       node aab/portfolio/stress.test.ts

   The engine behind the stress-testing case study computes
   things that are impossible to eyeball: a conditional default
   probability deep in the tail of a normal distribution, a
   capital requirement that has been in the Basel framework for
   twenty years, an expected credit loss that has to satisfy an
   accounting identity, and a bisection that has to invert the
   whole model.

   So none of it is checked against itself. Where an outside
   authority has published a number, that number is the test:
   Basel's own illustrative risk weights, the normal
   distribution's published quantiles, and the algebraic
   identities each formula has to satisfy whether or not it was
   coded correctly.
   ============================================================ */

import {
  normCdf, normInv, conditionalPd, anchorZ, correlation, maturityAdjustment,
  capitalRequirement, riskWeight, shockIndex, factorZ, shape, macroPath,
  lifecycle, hazardGamma, lgdFromCollateral, calibrateLgdSigma, lgdSigma,
  stressedLgd, stressedEad, stage2Share, lifetimePd, attribution,
  run, reverseStress, tornado, sensitivity, ladder,
  vintageCurves, parsePortfolioCsv, bookFor, toCsv,
  BOOK, SEGMENTS, MACRO, SCENARIOS, DEFAULTS, DRIVERS,
} from "./stress.model.js";
import type { Assumptions, Quarter, Segment } from "./stress.model.js";

let pass = 0;
const failures: string[] = [];

const ok = (name: string, cond: boolean): void => {
  if (cond) pass++; else failures.push(name);
};
const close = (name: string, got: number, want: number, tol: number): void =>
  ok(`${name} (got ${got}, want ${want})`, Math.abs(got - want) <= tol);

/* The shipped book is fixed, so every id named below is in it.
   `find` cannot know that, and a segment that has gone missing
   should stop the run rather than arrive as undefined. */
const segment = (id: string): Segment => {
  const seg = SEGMENTS.find((s) => s.id === id);
  if (!seg) throw new Error(`no segment ${id} in the shipped book`);
  return seg;
};

const A = { ...DEFAULTS };
const scenarioAssumptions = (id: string): Assumptions =>
  ({ ...DEFAULTS, ...SCENARIOS[id].peaks, scenario: id });

/* ---------- 1 · the normal distribution ----------
   Against printed tables. Everything downstream is one of these
   two functions with an argument, so an error here is an error
   in every number on the page. */
close("Φ(0) = 0.5", normCdf(0), 0.5, 1e-14);
close("Φ(1) = 0.8413447", normCdf(1), 0.8413447461, 1e-10);
close("Φ(1.959964) = 0.975", normCdf(1.959963985), 0.975, 1e-10);
close("Φ(-2.326348) = 0.01", normCdf(-2.326347874), 0.01, 1e-10);
close("Φ(-3.090232) = 0.001", normCdf(-3.090232306), 0.001, 1e-12);
close("Φ(-5) = 2.8665e-7", normCdf(-5), 2.866516e-7, 1e-12);
ok("Φ is symmetric", Math.abs((normCdf(1.3) + normCdf(-1.3)) - 1) < 1e-14);

close("Φ⁻¹(0.5) = 0", normInv(0.5), 0, 1e-12);
close("Φ⁻¹(0.975) = 1.959964", normInv(0.975), 1.959963985, 1e-9);
close("Φ⁻¹(0.999) = 3.090232", normInv(0.999), 3.090232306, 1e-9);
close("Φ⁻¹(0.01) = -2.326348", normInv(0.01), -2.326347874, 1e-9);
close("Φ⁻¹(0.0003) = -3.431614", normInv(0.0003), -3.4316139, 1e-6);
{
  let worst = 0;
  for (const p of [1e-6, 1e-4, 0.001, 0.02, 0.3, 0.5, 0.77, 0.99, 0.9999]) {
    worst = Math.max(worst, Math.abs(normCdf(normInv(p)) - p) / p);
  }
  ok(`Φ and Φ⁻¹ invert each other (worst relative error ${worst.toExponential(1)})`, worst < 1e-12);
}

/* ---------- 2 · the Vasicek conditional default rate ---------- */
close("ρ = 0 leaves PD alone at any Z", conditionalPd(0.03, 0, -3), 0.03, 1e-12);
close("PD(Z) at Z = Φ⁻¹(PD)(1-√(1-ρ))/√ρ is PD", conditionalPd(0.03, 0.15, anchorZ(0.03, 0.15)), 0.03, 1e-12);
ok("a bad economy raises the default rate", conditionalPd(0.03, 0.15, -2) > conditionalPd(0.03, 0.15, 0));
ok("a good economy lowers it", conditionalPd(0.03, 0.15, 2) < conditionalPd(0.03, 0.15, 0));
ok("more correlation, more damage from the same shock",
  conditionalPd(0.03, 0.30, -2) > conditionalPd(0.03, 0.10, -2));
ok("the conditional rate is a probability",
  [0.001, 0.05, 0.4].every((pd) => [-5, 0, 5].every((z) => {
    const v = conditionalPd(pd, 0.2, z);
    return v >= 0 && v <= 1;
  })));
/* The anchor is negative for any realistic PD, which is the
   skew argument the page makes: the average default year is
   already a worse-than-median year. */
ok("the anchor sits below zero for every shipped segment",
  SEGMENTS.every((s) => anchorZ(s.pdTtc, correlation(s.kind, s.pdTtc)) < 0));

/* Averaging the conditional rate over the whole distribution of
   Z has to give the unconditional rate back. Integrated here by
   Simpson's rule over ±8 sigma, which is a genuinely independent
   check on the formula: it uses no part of the model. */
{
  const pd = 0.03;
  const rho = 0.15;
  const n = 20000;
  const lo = -8;
  const hi = 8;
  const h = (hi - lo) / n;
  const f = (z: number): number => conditionalPd(pd, rho, z) * Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);
  let sum = f(lo) + f(hi);
  for (let i = 1; i < n; i++) sum += f(lo + i * h) * (i % 2 ? 4 : 2);
  close("E[PD(Z)] over the cycle returns the long-run PD", (sum * h) / 3, pd, 1e-6);
}

/* ---------- 3 · Basel's correlations ---------- */
close("mortgage correlation is the flat 0.15", correlation("mortgage", 0.02), 0.15, 1e-12);
close("revolving retail correlation is the flat 0.04", correlation("qrre", 0.02), 0.04, 1e-12);
ok("corporate correlation falls as PD rises",
  correlation("corporate", 0.001) > correlation("corporate", 0.10));
ok("corporate correlation stays inside its 0.12 to 0.24 band",
  [0.0003, 0.01, 0.05, 0.2].every((pd) => {
    const r = correlation("corporate", pd);
    return r >= 0.1199 && r <= 0.2401;
  }));
ok("other retail correlation stays inside its 0.03 to 0.16 band",
  [0.0003, 0.01, 0.05, 0.2].every((pd) => {
    const r = correlation("retail", pd);
    return r >= 0.0299 && r <= 0.1601;
  }));
close("the SME adjustment takes 4 points off", correlation("corporate", 0.02, { sizeAdjustment: 0.04 }),
  correlation("corporate", 0.02) - 0.04, 1e-12);
/* The maturity adjustment is not 1 at M = 2.5. The (1 − 1.5b)
   denominator normalises the whole expression, so a 2.5-year
   corporate exposure already carries a factor of about 1.26,
   which is exactly what makes the published 92.32% below come
   out right. Getting this wrong is a 20% error in corporate
   capital that looks like nothing at all. */
{
  const b = (0.11852 - 0.05478 * Math.log(0.01)) ** 2;
  close("the maturity adjustment at M = 2.5 is 1/(1 − 1.5b)",
    maturityAdjustment(0.01, 2.5), 1 / (1 - 1.5 * b), 1e-12);
}
ok("a longer maturity costs more capital", maturityAdjustment(0.01, 5) > maturityAdjustment(0.01, 1));

/* ---------- 4 · the IRB risk weights, against Basel's own table ----------
   BCBS published illustrative risk weights alongside the
   formula. These are those numbers. If the implementation is
   wrong anywhere, in the correlation, the maturity adjustment,
   the 99.9th percentile or the expected-loss deduction, it will
   not land on them. */
close("corporate, PD 1%, LGD 45%, M 2.5 → RW 92.32%",
  riskWeight({ pd: 0.01, lgd: 0.45, kind: "corporate", maturity: 2.5 }) * 100, 92.32, 0.02);
close("corporate, PD 0.10%, LGD 45%, M 2.5 → RW 29.65%",
  riskWeight({ pd: 0.001, lgd: 0.45, kind: "corporate", maturity: 2.5 }) * 100, 29.65, 0.02);
close("corporate, PD 5%, LGD 45%, M 2.5 → RW 149.86%",
  riskWeight({ pd: 0.05, lgd: 0.45, kind: "corporate", maturity: 2.5 }) * 100, 149.86, 0.03);
close("residential mortgage, PD 1%, LGD 45% → RW 56.40%",
  riskWeight({ pd: 0.01, lgd: 0.45, kind: "mortgage" }) * 100, 56.40, 0.02);
close("residential mortgage, PD 0.50%, LGD 45% → RW 35.08%",
  riskWeight({ pd: 0.005, lgd: 0.45, kind: "mortgage" }) * 100, 35.08, 0.02);
/* Other retail is not in the illustrative table above, so this
   one is worked by hand from the published formula: w = 1 −
   e^(−0.35) = 0.29531, ρ = 0.03w + 0.16(1 − w) = 0.121609, and
   K = 0.45·[Φ((−2.326348 + 0.348725·3.090232)/0.937225) − 0.01],
   which is 0.036617, so RW = 45.77%. */
close("other retail, PD 1%, LGD 45% → RW 45.77%",
  riskWeight({ pd: 0.01, lgd: 0.45, kind: "retail" }) * 100, 45.77, 0.02);
ok("and it sits between the revolving and mortgage treatments",
  riskWeight({ pd: 0.01, lgd: 0.45, kind: "qrre" })
  < riskWeight({ pd: 0.01, lgd: 0.45, kind: "retail" })
  && riskWeight({ pd: 0.01, lgd: 0.45, kind: "retail" })
  < riskWeight({ pd: 0.01, lgd: 0.45, kind: "mortgage" }));

/* The identity the whole page turns on: the capital formula is
   the same conditional default rate, read at the economy a
   1-in-1000 year draw would produce. */
{
  const pd = 0.02;
  const lgd = 0.45;
  const rho = correlation("mortgage", pd);
  const byHand = lgd * conditionalPd(pd, rho, -normInv(0.999)) - pd * lgd;
  close("capital requirement is the conditional loss at Z = −3.09, less expected loss",
    capitalRequirement({ pd, lgd, kind: "mortgage" }), byHand, 1e-14);
}
close("capital scales linearly in LGD",
  capitalRequirement({ pd: 0.02, lgd: 0.60, kind: "mortgage" }),
  capitalRequirement({ pd: 0.02, lgd: 0.30, kind: "mortgage" }) * 2, 1e-14);
ok("the Basel PD floor bites below 3bp",
  capitalRequirement({ pd: 1e-6, lgd: 0.45, kind: "corporate" })
  === capitalRequirement({ pd: 0.0003, lgd: 0.45, kind: "corporate" }));

/* ---------- 5 · loss given default as a put on the collateral ---------- */
close("no dispersion and full cover leaves nothing to lose",
  lgdFromCollateral(2, 0, 0), 0, 1e-12);
close("no dispersion and half cover loses half",
  lgdFromCollateral(0.5, 0, 0), 0.5, 1e-12);
ok("more dispersion, more expected loss",
  lgdFromCollateral(1.2, 0.2, 0.9) > lgdFromCollateral(1.2, 0.2, 0.4));
ok("falling collateral prices raise the loss",
  lgdFromCollateral(1.2, 0.2, 0.6, -0.3) > lgdFromCollateral(1.2, 0.2, 0.6, 0));
ok("the loss given default stays a fraction",
  [-0.9, -0.3, 0, 0.5].every((sh) => {
    const v = lgdFromCollateral(1.2, 0.2, 0.6, sh);
    return v >= 0 && v <= 1;
  }));
/* The option's convexity, which is the whole argument for
   modelling it this way: the second slice of a price fall costs
   more than the first. */
{
  const at = (sh: number): number => lgdFromCollateral(1.5, 0.2, 0.7, sh);
  const first = at(-0.1) - at(0);
  const second = at(-0.2) - at(-0.1);
  ok(`the second ten per cent off collateral costs more than the first (${first.toFixed(4)} then ${second.toFixed(4)})`,
    second > first);
}
{
  const sigma = calibrateLgdSigma(1.55, 0.18, 0.20);
  /* null would mean no dispersion reproduces that loss given
     default, which for these three numbers would be the bug. */
  if (sigma === null) throw new Error("the calibration found no dispersion");
  close("the calibration reproduces the stated loss given default",
    lgdFromCollateral(1.55, 0.18, sigma), 0.20, 1e-6);
}
ok("every secured segment's calibration round-trips",
  SEGMENTS.filter((s) => lgdSigma(s) !== null).every((s) =>
    Math.abs(stressedLgd(s, { propertyLevel: 0, s: 0 }) - s.lgdBase) < 1e-6));
ok("every unsecured segment starts at its stated loss given default",
  SEGMENTS.filter((s) => lgdSigma(s) === null).every((s) =>
    Math.abs(stressedLgd(s, { propertyLevel: 0, s: 0 }) - s.lgdBase) < 1e-12));
ok("collateral prices do not move an unsecured loss given default",
  SEGMENTS.filter((s) => lgdSigma(s) === null).every((s) =>
    stressedLgd(s, { propertyLevel: -40, s: 0 }) === stressedLgd(s, { propertyLevel: 0, s: 0 })));
ok("a car book does not reprice with the property index",
  stressedLgd(segment("auto"), { propertyLevel: -30, s: 0 })
  < stressedLgd(segment("home"), { propertyLevel: -30, s: 0 })
  / segment("home").lgdBase * segment("auto").lgdBase);
ok("turning the downturn effect off freezes the loss given default",
  SEGMENTS.every((s) =>
    Math.abs(stressedLgd(s, { propertyLevel: -40, s: 3, lgdDownturn: 0 }) - s.lgdBase) < 1e-9));

/* ---------- 6 · exposure at default ---------- */
{
  const card = segment("card");
  const drawn = card.ead * (1 - card.stage3Opening);
  close("with no stress the drawdown is the stated conversion factor",
    stressedEad(card, drawn, { s: 0, ccfStress: 0.25 }), drawn + card.ccf * card.undrawn, 1e-9);
  ok("a shock draws more of the limit",
    stressedEad(card, drawn, { s: 2, ccfStress: 0.25 }) > stressedEad(card, drawn, { s: 0, ccfStress: 0.25 }));
  ok("the conversion factor cannot exceed the limit",
    stressedEad(card, drawn, { s: 20, ccfStress: 0.5 }) <= drawn + card.undrawn + 1e-9);
  const home = segment("home");
  ok("a term loan has nothing left to draw",
    stressedEad(home, 100, { s: 3, ccfStress: 0.5 }) === 100);
}

/* ---------- 7 · the scenario path ---------- */
close("nothing has happened at quarter zero", shape(0, A), 0, 1e-12);
close("the peak is reached at the peak quarter", shape(A.quartersToPeak, A), 1, 1e-12);
close("the shock halves one half-life after the peak",
  shape(A.quartersToPeak + A.halfLife, A), 0.5, 1e-12);
close("and quarters again after two", shape(A.quartersToPeak + 2 * A.halfLife, A), 0.25, 1e-12);
ok("the ramp is monotone up to the peak",
  [1, 2, 3, 4, 5].filter((q) => q <= A.quartersToPeak)
    .every((q, i, arr) => i === 0 || shape(q, A) > shape(arr[i - 1], A)));

{
  const path = macroPath(A);
  ok("the path covers the horizon and its starting point", path.length === BOOK.horizonQuarters + 1);
  ok("every variable starts at its own base level",
    MACRO.every((m) => Math.abs(path[0].levels[m.key] - m.base) < 1e-12));
  ok("every variable peaks at the peak quarter",
    MACRO.every((m) => Math.abs(path[A.quartersToPeak].levels[m.key] - (m.base + A[m.key])) < 1e-12));
}

/* ---------- 8 · macro to systematic factor ---------- */
ok("the betas of every segment sum to one",
  SEGMENTS.every((s) => Math.abs(MACRO.reduce((t, m) => t + (s.betas[m.key] ?? 0), 0) - 1) < 1e-9));
{
  const base = Object.fromEntries(MACRO.map((m) => [m.key, m.base]));
  ok("no deviation, no shock",
    SEGMENTS.every((s) => Math.abs(shockIndex(base, s.betas)) < 1e-12));

  /* Because the betas sum to one, a scenario in which every
     variable is exactly two standard deviations bad has to give
     a shock index of exactly two, in every segment. That is the
     property that makes the scale readable. */
  const twoSigma = Object.fromEntries(MACRO.map((m) =>
    [m.key, m.base + (m.badWhen === "down" ? -2 : 2) * m.sd]));
  ok("a two-sigma move in everything is a two-sigma shock, in every segment",
    SEGMENTS.every((s) => Math.abs(shockIndex(twoSigma, s.betas) - 2) < 1e-9));
  ok("and the systematic factor is minus that",
    Math.abs(factorZ(twoSigma, SEGMENTS[0].betas, 1) + 2) < 1e-9);
  ok("the transmission dial scales it",
    Math.abs(factorZ(twoSigma, SEGMENTS[0].betas, 0.5) + 1) < 1e-9);
}

/* ---------- 9 · seasoning and the vintage link ---------- */
ok("a loan that has not been written cannot default", lifecycle(0, SEGMENTS[0]) === 0);
close("the seasoning curve peaks at the peak month, at one",
  lifecycle(SEGMENTS[0].peakMonth, SEGMENTS[0]), 1, 1e-12);
ok("the seasoning curve really does peak there",
  SEGMENTS.every((s) => {
    const p = lifecycle(s.peakMonth, s);
    return p > lifecycle(s.peakMonth - 6, s) && p > lifecycle(s.peakMonth + 6, s);
  }));

/* The calibration that makes the two engines comparable: the log
   link and the probit link agree exactly at a one-sigma shock,
   and by construction at no shock at all. */
{
  const pd = 0.03;
  const rho = 0.18;
  const gamma = hazardGamma(pd, rho);
  close("the two links agree at no shock", pd * Math.exp(gamma * 0), pd, 1e-15);
  close("and at exactly one sigma",
    pd * Math.exp(gamma * 1), conditionalPd(pd, rho, anchorZ(pd, rho) - 1), 1e-12);
  ok("past two sigma the log link is the harsher of the two",
    pd * Math.exp(gamma * 2.5) > conditionalPd(pd, rho, anchorZ(pd, rho) - 2.5));
  ok("and below one sigma it is the milder",
    pd * Math.exp(gamma * 0.5) < conditionalPd(pd, rho, anchorZ(pd, rho) - 0.5));
}

/* ---------- 10 · IFRS 9 staging ---------- */
close("half the book has crossed when the average loan has",
  stage2Share(2, 2, 0.6), 0.5, 1e-12);
ok("a quiet book still has a stage 2 population", stage2Share(1, 2, 0.6) > 0.02);
ok("stage 2 grows with the deterioration", stage2Share(3, 2, 0.6) > stage2Share(1.5, 2, 0.6));
ok("a tighter spread makes the crossing sharper",
  stage2Share(3, 2, 0.3) > stage2Share(3, 2, 0.9));
ok("the share is a share",
  [0.5, 1, 2, 10, 100].every((r) => {
    const v = stage2Share(r, 2, 0.6);
    return v >= 0 && v <= 1;
  }));
close("a one-year lifetime PD is the annual one", lifetimePd(0.04, 1), 0.04, 1e-12);
close("compounding over three years", lifetimePd(0.04, 3), 1 - 0.96 ** 3, 1e-12);
ok("lifetime PD rises with the life", lifetimePd(0.04, 5) > lifetimePd(0.04, 3));

/* ---------- 11 · the roll-forward, on the base scenario ----------
   With no shock at all, the point-in-time rate has to come back
   as the through-the-cycle rate, in every segment and every
   quarter. That is one identity holding across the whole
   machine: the anchor, the conditional formula, the macro
   standardisation and the path. */
{
  const baseA = scenarioAssumptions("base");
  const r = run(baseA);
  ok("no shock leaves every default rate at its long-run level",
    r.runs.every((seg) => seg.quarters.every((q) =>
      Math.abs(q.pdMerton - seg.seg.pdTtc) < 1e-9)));
  ok("no shock leaves every loss given default at its stated level",
    r.runs.every((seg) => seg.quarters.every((q) =>
      Math.abs(q.lgd - seg.seg.lgdBase) < 1e-6)));
  ok("no shock, no deterioration ratio", r.runs.every((seg) =>
    seg.quarters.every((q) => Math.abs(q.ratio - 1) < 1e-9)));
  ok("the base case ratio never falls below where it started",
    r.quarters.every((q) => q.ratio >= r.openingRatio - 1e-9));
  ok("the base case pays dividends", r.quarters.slice(1).every((q) => (q.dividend ?? 0) > 0));
}

/* Exposure conservation. Run a book with no undrawn limits, so
   nothing can be drawn down at default, and the performing book
   plus stage 3 has to be exactly constant: a static balance
   sheet replaces amortisation and write-offs, and a defaulted
   loan is still on the balance sheet until it is written off. */
{
  const seg = { ...segment("home"), undrawn: 0 };
  const r = run(scenarioAssumptions("severe"), [seg], BOOK);
  const total = (q: Quarter): number => q.performing + q.stage3;
  const opening = total(r.quarters[0]);
  const worst = Math.max(...r.quarters.map((q) => Math.abs(total(q) - opening)));
  close(`exposure is conserved to within ${worst.toExponential(1)}`, worst, 0, 1e-6);
}

/* The provision identity: what goes through the profit and loss
   account over the whole horizon has to be the movement in the
   allowance plus everything written off against it. */
{
  const r = run(A);
  const bad = r.runs.filter((seg) => {
    const charges = seg.quarters.reduce((t, q) => t + q.charge, 0);
    const movement = seg.quarters[seg.quarters.length - 1].ecl - seg.openingEcl;
    const writeOffs = seg.quarters.reduce((t, q) => t + q.writeOff * q.lgd, 0);
    return Math.abs(charges - (movement + writeOffs)) > 1e-6;
  });
  ok("provisions reconcile: charge = movement in the allowance + write-offs", bad.length === 0);
}

/* ---------- 12 · severity does what severity should ---------- */
{
  const b = run(scenarioAssumptions("base"));
  const adv = run(scenarioAssumptions("adverse"));
  const sev = run(scenarioAssumptions("severe"));

  ok("a worse scenario costs more", b.cumulativeLoss < adv.cumulativeLoss
    && adv.cumulativeLoss < sev.cumulativeLoss);
  ok("a worse scenario leaves less capital", b.trough.ratio > adv.trough.ratio
    && adv.trough.ratio > sev.trough.ratio);
  ok("a worse scenario moves more of the book to stage 2",
    Math.max(...adv.quarters.slice(1).map((q) => q.stage2))
    < Math.max(...sev.quarters.slice(1).map((q) => q.stage2)));
  ok("the base case is a one-in-nothing event", !Number.isFinite(b.returnPeriod));
  ok("the adverse scenario is rarer than once a decade", adv.returnPeriod > 10);
  ok("the severe scenario is rarer than the adverse one", sev.returnPeriod > adv.returnPeriod);
  ok("both stay well short of the capital formula's one in a thousand",
    sev.returnPeriod < 1000 && Math.abs(sev.capitalZ + 3.090232) < 1e-6);
  ok("the severe scenario breaches the requirement", !sev.passes);
  ok("the base case does not", b.passes);
}

/* The three risk-weight bases have to order themselves: holding
   the PD at its long-run average is the mildest reading, fully
   point-in-time the harshest, and the default sits between. */
{
  const ttc = run({ ...scenarioAssumptions("adverse"), rwaBasis: "ttc" });
  const hyb = run({ ...scenarioAssumptions("adverse"), rwaBasis: "hybrid" });
  const pit = run({ ...scenarioAssumptions("adverse"), rwaBasis: "pit" });
  ok("point-in-time risk weights are the harshest reading",
    pit.trough.ratio < hyb.trough.ratio && hyb.trough.ratio < ttc.trough.ratio);
  ok("the basis changes no losses at all, only their measurement",
    Math.abs(pit.cumulativeLoss - ttc.cumulativeLoss) < 1e-9);
  ok("through-the-cycle risk weights still rise a little, through the downturn LGD",
    ttc.trough.rwa > ttc.openingRwa);
}

/* ---------- 13 · the attribution adds up ---------- */
{
  const r = run(scenarioAssumptions("adverse"));
  const at = r.attribution;
  close("the two halves of the capital fall add to the whole",
    at.fromCapital + at.fromRwa, at.totalBps, 1e-9);
  ok("both halves are doing damage", at.fromCapital < 0 && at.fromRwa < 0);
  const ttc = run({ ...scenarioAssumptions("adverse"), rwaBasis: "ttc" });
  ok("on long-run risk weights, losses do nearly all of it",
    Math.abs(ttc.attribution.fromRwa) < Math.abs(ttc.attribution.fromCapital));
}

/* ---------- 14 · the two engines ---------- */
{
  const b = run({ ...scenarioAssumptions("base"), engine: "vintage" });
  ok("with no shock the vintage engine reproduces the long-run rate in the first quarter",
    b.runs.every((seg) => Math.abs(seg.quarters[0].pdVintageLink - seg.seg.pdTtc) < 1e-12));
  ok("and the mix effect starts at exactly one",
    b.runs.every((seg) => Math.abs(seg.quarters[0].mix - 1) < 1e-9));

  const merton = run(scenarioAssumptions("severe"));
  const vintage = run({ ...scenarioAssumptions("severe"), engine: "vintage" });
  ok("the two engines disagree about a severe scenario",
    Math.abs(merton.cumulativeLoss - vintage.cumulativeLoss) > 1);
  ok("but not by more than a third of the loss",
    Math.abs(merton.cumulativeLoss - vintage.cumulativeLoss) / merton.cumulativeLoss < 0.34);
  ok("the gap is reported at the worst quarter of the scenario",
    merton.engineGap.q === merton.quarters.slice(1)
      .reduce((w, x) => (x.s > w.s ? x : w), merton.quarters[1]).q);
  ok("a base scenario has no link gap at all",
    Math.abs(run(scenarioAssumptions("base")).engineGap.ratio - 1) < 1e-9);
}

/* ---------- 15 · vintage curves ---------- */
{
  const r = run(A);
  const home = segment("home");
  const curves = vintageCurves(home, r.path, A);
  ok("one curve per vintage", curves.length === home.vintages.length);
  ok("every curve starts at zero", curves.every((c) => c.points[0].cum === 0));
  ok("cumulative default rates never fall",
    curves.every((c) => c.points.every((p, i) => i === 0 || p.cum >= c.points[i - 1].cum - 1e-12)));
  ok("and never exceed the whole cohort",
    curves.every((c) => c.points.every((p) => p.cum <= 1)));
  ok("history is solid and the rest is projection",
    curves.every((c) => c.points.every((p) => p.projected === (p.age > c.asOfAge))));
  /* The cohort effect: the 2022 book was written loose, so at
     the same age it is worse than the 2021 one. This is the
     claim the vintage chart exists to make, so it is checked
     rather than asserted. */
  {
    const at = (label: string, age: number): number => {
      const point = curves.find((c) => c.label === label)?.points.find((p) => p.age === age);
      if (!point) throw new Error(`no ${label} vintage at ${age} months on book`);
      return point.cum;
    };
    ok("the 2022 vintage is worse than the 2021 one at the same age", at("2022", 30) > at("2021", 30));
    ok("and the 2020 vintage is the best of the three", at("2020", 30) < at("2021", 30));
  }
}

/* ---------- 16 · reverse stress ---------- */
{
  const rev = reverseStress(A);
  ok("a breaking scenario exists somewhere below six times the adverse one", rev.found);
  /* Everything below reads the multiple the search landed on, and
     a search that found nothing has none to read. */
  if (!rev.found || rev.unemployment === undefined) {
    throw new Error("the reverse stress found no breaking scenario");
  }
  const back = run(Object.fromEntries([
    ...Object.entries(A),
    ...MACRO.map((m) => [m.key, (A[m.key] ?? 0) * rev.multiple]),
  ]));
  close("putting the answer back through the model lands on the requirement",
    back.trough.ratio, BOOK.requirement, 5e-4);
  ok("the reverse-stressed scenario is stated in unemployment as well as multiples",
    Math.abs(rev.unemployment - A.unemployment * rev.multiple) < 1e-9);
  /* More capital, more scenario needed to break it. And where
     no multiple inside the search breaks the bank, the function
     has to say it found nothing rather than return the edge of
     its own search as an answer. */
  const fortress = reverseStress(A, SEGMENTS, { ...BOOK, cet1: BOOK.cet1 * 1.5 });
  ok("a better capitalised bank takes a bigger scenario to break",
    fortress.found && fortress.multiple > rev.multiple);
  ok("and a search that never reaches the requirement says so",
    !reverseStress(A, SEGMENTS, BOOK, { max: 0.3 }).found);
}

/* ---------- 17 · the tornado ---------- */
{
  const t = tornado(scenarioAssumptions("severe"));
  ok("every macro variable gets a bar", t.bars.length === MACRO.length);
  ok("the bars are sorted by how much damage they do",
    t.bars.every((b, i) => i === 0 || b.marginal <= t.bars[i - 1].marginal));
  ok("every shock in an adverse direction costs something",
    t.bars.every((b) => b.marginal >= -1e-9));
  /* The finding the chart exists for: the parts do not add up to
     the whole, because the loss function is convex and shocks
     arriving together cost more than the same shocks arriving
     one at a time. */
  ok("shocks arriving together cost more than the sum of the parts",
    t.interaction > 0 && t.together > t.sumOfParts);
  ok("each bar is a real run of the model",
    Math.abs(t.bars[0].marginal - (run({
      ...Object.fromEntries(MACRO.map((m) => [m.key, 0])),
      ...scenarioAssumptions("severe"),
      ...Object.fromEntries(MACRO.filter((m) => m.key !== t.bars[0].key).map((m) => [m.key, 0])),
    }).cumulativeLoss - t.baseline)) < 1e-6);
}

/* ---------- 18 · the sensitivity grid ---------- */
{
  close("a ladder is centred on its centre", ladder(10, 2, 5)[2], 10, 1e-12);
  ok("and evenly spaced", ladder(10, 2, 5).join() === "6,8,10,12,14");

  const grid = sensitivity(A);
  ok("the grid is square", grid.cells.length === 5 && grid.cells.every((r) => r.length === 5));
  ok("the middle cell is the live one", grid.base.row === 2 && grid.base.col === 2);
  const centre = grid.cells[2][2];
  const live = run({ ...A, [grid.rowKey]: grid.rows[2], [grid.colKey]: grid.cols[2] });
  close("and it agrees with the live run", centre.ratio, live.trough.ratio, 1e-12);
  /* Every cell is a full revaluation. Two of them are checked
     against a run made here, which is the only way to know the
     grid is not interpolating between corners. */
  const spot = run({ ...A, [grid.rowKey]: grid.rows[0], [grid.colKey]: grid.cols[4] });
  close("a corner cell is a complete run of the model",
    grid.cells[0][4].ratio, spot.trough.ratio, 1e-12);
  ok("more unemployment leaves less capital, down every column",
    grid.cols.every((_, j) => grid.cells.every((row, i) =>
      i === 0 || row[j].ratio <= grid.cells[i - 1][j].ratio + 1e-9)));
  ok("stronger transmission leaves less capital, along every row",
    grid.cells.every((row) => row.every((c, j) => j === 0 || c.ratio <= row[j - 1].ratio + 1e-9)));
  ok("a cell knows whether it passes", grid.cells.flat().every((c) =>
    c.passes === (c.ratio >= BOOK.requirement)));
}

/* ---------- 19 · determinism ---------- */
{
  const a = run(A);
  const b = run(A);
  ok("the same assumptions give the same answer, exactly",
    a.trough.ratio === b.trough.ratio && a.cumulativeLoss === b.cumulativeLoss);
}

/* ---------- 20 · bringing your own book ---------- */
{
  const csv = [
    "segment,exposure,pd,lgd,kind",
    "Mortgages,5000,0.9%,25%,mortgage",
    "Cards,800,7.5%,80%,card",
    'Corporate,"12,500",0.021,0.35,corporate',
  ].join("\n");
  const { segments, errors } = parsePortfolioCsv(csv);
  ok("three rows, and the header is not one of them", segments.length === 3);
  ok("no errors on a clean file", errors.length === 0);
  close("a percentage is read as one", segments[0].pdTtc, 0.009, 1e-12);
  close("a decimal is read as one", segments[2].pdTtc, 0.021, 1e-12);
  close("a quoted thousands separator survives", segments[2].ead, 12500, 1e-9);
  ok("the kind column picks the Basel treatment",
    segments[0].kind === "mortgage" && segments[1].kind === "qrre" && segments[2].kind === "corporate");
  ok("an imported book still runs", run(A, segments, bookFor(segments, A)).quarters.length === 13);
  close("and it opens on the same capital ratio as the shipped one",
    run(A, segments, bookFor(segments, A)).openingRatio, run(A).openingRatio, 1e-9);

  const bad = parsePortfolioCsv("segment,exposure,pd,lgd\nOops,1000,250%,40%");
  ok("a probability above one is refused", bad.errors.some((e) => /not a probability/.test(e)));
  ok("and nothing usable is returned", bad.segments.length === 0);
}

/* ---------- 21 · the CSV that comes out ---------- */
{
  const csv = toCsv(A);
  const r = run(A);
  ok("the export names the book", csv.includes(BOOK.name));
  ok("it carries every macro variable", MACRO.every((m) => csv.includes(m.label)));
  ok("it carries every driver", DRIVERS.every((d) => csv.includes(d.label)));
  ok("it carries every segment", SEGMENTS.every((s) => csv.includes(s.name)));
  ok("it states the trough ratio to the same two places the page does",
    csv.includes((r.trough.ratio * 100).toFixed(2)));
  ok("it has one row per quarter plus the opening position",
    csv.split("\n").filter((l) => /^Q\d+,/.test(l)).length === BOOK.horizonQuarters);
}

/* ---------- 22 · the shipped book is what it claims to be ---------- */
ok("every segment's vintage shares sum to one",
  SEGMENTS.every((s) => Math.abs(s.vintages.reduce((t, v) => t + v.share, 0) - 1) < 1e-9));
ok("every vintage is older than the one after it",
  SEGMENTS.every((s) => s.vintages.every((v, i) =>
    i === 0 || v.ageMonths < s.vintages[i - 1].ageMonths)));
ok("the loss given default floor is below the loss given default",
  SEGMENTS.every((s) => s.lgdFloor < s.lgdBase));
ok("every default rate is a probability and every loss a fraction",
  SEGMENTS.every((s) => s.pdTtc > 0 && s.pdTtc < 1 && s.lgdBase > 0 && s.lgdBase <= 1));
ok("every segment has a Basel treatment",
  SEGMENTS.every((s) => ["mortgage", "retail", "qrre", "corporate"].includes(s.kind)));
ok("the unsecured segments are the ones with no collateral",
  SEGMENTS.every((s) => s.secured === (s.collateralCoverage > 0)));
ok("the book is the size the page says it is",
  Math.abs(SEGMENTS.reduce((t, s) => t + s.ead, 0) - 18_920) < 1);
ok("the opening capital ratio is above the requirement",
  run(A).openingRatio > BOOK.requirement);
ok("the requirement is the minimum plus the conservation buffer",
  Math.abs(BOOK.requirement - (BOOK.minimumCet1 + 0.025)) < 1e-12);
ok("every driver has a range that contains its default",
  DRIVERS.every((d) => DEFAULTS[d.key] >= d.min && DEFAULTS[d.key] <= d.max));
ok("the defaults are the adverse scenario",
  MACRO.every((m) => DEFAULTS[m.key] === SCENARIOS.adverse.peaks[m.key]));

/* ---------- 23 · the attribution helper on its own ---------- */
{
  const at = attribution(0.10, 1000, 10000, { ratio: 0.08, cet1: 900, rwa: 11250 });
  close("no capital change means the whole move is risk weights",
    attribution(0.10, 1000, 10000, { ratio: 1000 / 12500, cet1: 1000, rwa: 12500 }).fromCapital, 0, 1e-9);
  close("no risk-weight change means the whole move is capital",
    attribution(0.10, 1000, 10000, { ratio: 0.09, cet1: 900, rwa: 10000 }).fromRwa, 0, 1e-9);
  close("and in between it still adds up", at.fromCapital + at.fromRwa, at.totalBps, 1e-9);
}

/* ---------- report ---------- */
const total = pass + failures.length;
if (failures.length) {
  console.error(`✗ ${failures.length} of ${total} checks failed:\n`);
  failures.forEach((f) => console.error(`   · ${f}`));
  process.exit(1);
}
console.log(`✓ all ${total} checks passed`);
