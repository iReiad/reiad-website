/* ============================================================
   scripts/research-stats.test.ts: the lab's arithmetic held to
   closed forms. RESEARCH.md section 14 asks for R's answer to
   four decimals; where no R was to hand the reference is a hand
   computation or an identity that R would also satisfy (t with
   one degree of freedom is Cauchy, F(2, v) has a closed CDF, a
   saturated difference in differences is four means), which is
   a stronger check than a number copied from a console.

     node scripts/research-stats.test.ts
   ============================================================ */

import {
  adf, anova, capm, chi2Cdf, chiSquare, correlation, csad, degreeDays, describe, did, eventStudyReturns, famaMacBeth, fCdf, glm, historicalVaR,
  indexInsurance, inverse, mannWhitney, meanVariance, normalCdf, normalInv, ols, panelFE, rainfallShock, returns, sharpe, spearman, stochasticDominance,
  surveyMean, tCdf, tsls, tTest, quantile,
} from "../shared/research-stats.ts";
import { agreesToPrecision, compareRuns, modelOf, paperGap } from "../shared/research-lab.ts";

let passed = 0;
const failures: string[] = [];
const ok = (name: string, cond: unknown, detail = ""): void => {
  if (cond) passed += 1; else failures.push(`${name}${detail ? `: ${detail}` : ""}`);
};
const near = (a: number, b: number, places = 4): boolean => Math.abs(a - b) < 0.5 * 10 ** -places;
const show = (v: number): string => v.toFixed(6);

/* ---- distributions, against exact forms ---- */
ok("Φ(1.96) = 0.9750", near(normalCdf(1.96), 0.9750021, 5), show(normalCdf(1.96)));
ok("Φ(1) = 0.8413", near(normalCdf(1), 0.8413447, 5), show(normalCdf(1)));
ok("Φ⁻¹(0.975) = 1.9600", near(normalInv(0.975), 1.959964, 5), show(normalInv(0.975)));
ok("t with df 1 is Cauchy", near(tCdf(1, 1), 0.5 + Math.atan(1) / Math.PI, 6), show(tCdf(1, 1)));
ok("t with df 2 has a closed CDF", near(tCdf(1.5, 2), 0.5 + 1.5 / (2 * Math.sqrt(2 + 2.25)), 6), show(tCdf(1.5, 2)));
ok("t with df 3 at 2.1213", near(tCdf(2.1213, 3), 0.937985, 5), show(tCdf(2.1213, 3)));
ok("chi-square with df 2 is exponential", near(chi2Cdf(3, 2), 1 - Math.exp(-1.5), 6), show(chi2Cdf(3, 2)));
ok("chi-square with df 1 is a folded normal", near(chi2Cdf(2.5, 1), 2 * normalCdf(Math.sqrt(2.5)) - 1, 5), show(chi2Cdf(2.5, 1)));
ok("F(2, v) has a closed CDF", near(fCdf(3, 2, 6), 1 - (1 + 2 * 3 / 6) ** -3, 6), show(fCdf(3, 2, 6)));
ok("F(1, v) is t squared", near(fCdf(4, 1, 10), 2 * tCdf(2, 10) - 1, 6), show(fCdf(4, 1, 10)));

/* ---- descriptives ---- */
const d = describe([2, 4, 4, 4, 5, 5, 7, 9, null]);
ok("describe: n, missing, mean, sd", d.n === 8 && d.missing === 1 && near(d.mean, 5) && near(d.sd, Math.sqrt(32 / 7)), JSON.stringify(d));
ok("describe: median and quartiles by linear interpolation", near(d.median, 4.5) && near(d.q1, 4) && near(d.q3, 5.5), `${d.q1} ${d.median} ${d.q3}`);
ok("quantile of an odd list is the middle value", quantile([1, 2, 3], 0.5) === 2);
const x = [1, 2, 3, 4, 5];
ok("correlation of x with 2x+1 is 1 and with -x is -1", near(correlation([x, x.map((v) => 2 * v + 1)])[0][1], 1, 8) && near(correlation([x, x.map((v) => -v)])[0][1], -1, 8));
ok("spearman is rank correlation", near(spearman([1, 2, 3, 4], [10, 100, 1000, 10000]), 1, 8));
ok("inverse of [[4,7],[2,6]]", (() => { const i = inverse([[4, 7], [2, 6]]); return near(i[0][0], 0.6) && near(i[0][1], -0.7) && near(i[1][0], -0.2) && near(i[1][1], 0.4); })());

/* ---- tests ---- */
const w = tTest([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
ok("Welch t: statistic and Satterthwaite df by hand", near(w.t, -3 / Math.sqrt(2.5)) && near(w.df, 6.25 / (0.0625 + 1)), `${show(w.t)} ${show(w.df)}`);
ok("Welch t: p in (0.10, 0.11)", w.p > 0.10 && w.p < 0.11, show(w.p));
const pr = tTest([3, 5, 7], [1, 2, 3], true);
ok("paired t: mean difference 3, se of the differences", near(pr.diff, 3) && near(pr.se, Math.sqrt(1 / 3)), `${pr.diff} ${pr.se}`);
const a = anova([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
ok("ANOVA: F = 3 on (2, 6) and p = 0.125 exactly", near(a.f, 3) && a.df1 === 2 && a.df2 === 6 && near(a.p, 0.125, 5), `${show(a.f)} ${show(a.p)}`);
const c = chiSquare([[10, 20], [20, 10]]);
ok("chi-square 2x2: 6.6667 on 1 df, p = 0.0098", near(c.chi2, 6.6667) && c.df === 1 && near(c.p, 0.0098, 4), `${show(c.chi2)} ${show(c.p)}`);
const mw = mannWhitney([1, 2, 3], [4, 5, 6]);
ok("Mann-Whitney: U = 0, z = -1.964", mw.u === 0 && near(mw.z, -4.5 / Math.sqrt(5.25)), `${mw.u} ${show(mw.z)}`);

/* ---- OLS, by Cramer's rule and by hand ---- */
const y = [2, 4, 5, 4, 5];
const f = ols(y, x.map((v) => [v]), ["x"]);
ok("OLS: intercept 2.2, slope 0.6", near(f.coef[0], 2.2) && near(f.coef[1], 0.6), f.coef.map(show).join(" "));
ok("OLS: classical standard errors", near(f.se[1], Math.sqrt(0.08)) && near(f.se[0], Math.sqrt(0.88)), f.se.map(show).join(" "));
ok("OLS: R squared 0.6, sigma root 0.8, df 3", near(f.r2, 0.6) && near(f.sigma, Math.sqrt(0.8)) && f.df === 3, `${show(f.r2)} ${show(f.sigma)} ${f.df}`);
ok("OLS: p on the slope from t = 2.1213 on 3 df", near(f.p[1], 0.12403, 4), show(f.p[1]));
const h0 = ols(y, x.map((v) => [v]), ["x"], { robust: "HC0" });
const h1 = ols(y, x.map((v) => [v]), ["x"], { robust: "HC1" });
ok("HC0 sandwich by hand: var(slope) = 0.0344", near(h0.se[1] ** 2, 0.0344, 5) && near(h0.se[0] ** 2, 0.5496, 5), `${show(h0.se[1] ** 2)} ${show(h0.se[0] ** 2)}`);
ok("HC1 is HC0 times n/(n-k)", near(h1.se[1] ** 2, 0.0344 * 5 / 3, 5), show(h1.se[1] ** 2));
const exact = ols([6, 11, 16, 21, 26, 31], [[1, 1], [2, 2], [3, 3.5], [4, 5], [5, 6], [6, 7]].map(([p, q]) => [p, q]), ["p", "q"]);
ok("OLS on exact data recovers the plane", exact.residuals.every((e) => Math.abs(e) < 1e-9) && near(exact.r2, 1, 8), exact.coef.map(show).join(" "));
const cl = ols(y, x.map((v) => [v]), ["x"], { cluster: ["a", "a", "b", "b", "c"] });
ok("clustered: G-1 degrees of freedom and Stata's factor", cl.df === 2 && cl.clusters === 3 && cl.robust === "cluster" && cl.se[1] > 0, `${cl.df} ${cl.clusters}`);

/* ---- logit and probit ---- */
const yb = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
const l0 = glm(yb, yb.map(() => []), [], "logit");
ok("intercept-only logit is the log odds with se root 1/(np(1-p))", near(l0.coef[0], Math.log(3 / 7)) && near(l0.se[0], Math.sqrt(1 / 2.1)), `${show(l0.coef[0])} ${show(l0.se[0])}`);
const p0 = glm(yb, yb.map(() => []), [], "probit");
ok("intercept-only probit is Φ⁻¹(p)", near(normalCdf(p0.coef[0]), 0.3, 5), show(p0.coef[0]));
const yt = [...Array(6).fill(1), ...Array(4).fill(0), ...Array(2).fill(1), ...Array(8).fill(0)];
const xt = [...Array(10).fill(1), ...Array(10).fill(0)].map((v) => [v]);
const lt = glm(yt, xt, ["x"], "logit");
ok("logit on a 2x2 table is the log odds ratio, with the usual se",
  near(lt.coef[0], Math.log(2 / 8)) && near(lt.coef[1], Math.log(6 / 4) - Math.log(2 / 8)) && near(lt.se[1], Math.sqrt(1 / 2 + 1 / 8 + 1 / 6 + 1 / 4)),
  `${lt.coef.map(show).join(" ")} se ${lt.se.map(show).join(" ")}`);

/* ---- panels, DiD, IV, surveys ---- */
const ent = ["a", "a", "a", "b", "b", "b"];
const xp = [1, 2, 3, 2, 4, 6];
const yp = xp.map((v, i) => 3 * v + (ent[i] === "a" ? 10 : -5));
const fe = panelFE(yp, xp.map((v) => [v]), ["x"], ent);
ok("fixed effects recover the slope through entity effects", near(fe.coef[0], 3, 8) && fe.extra?.entities === 2, `${show(fe.coef[0])}`);
const yd = [10, 12, 20, 25];
const dd = did(yd, [0, 0, 1, 1], [0, 1, 0, 1]);
ok("DiD on four cells is the double difference: (25-20)-(12-10) = 3", near(dd.coef[3], 3, 8), show(dd.coef[3]));
const z = [1, 2, 3, 4, 5, 6];
const xe = z.map((v) => 2 * v + (v % 2 ? 0.5 : -0.5));
const yi = xe.map((v, i) => 1 + 0.7 * v + (i % 3 === 0 ? 0.3 : -0.15));
const iv = tsls(yi, xe.map((v) => [v]), yi.map(() => []), z.map((v) => [v]), { endog: ["x"], exog: [] });
const cov = (p: number[], q: number[]): number => { const mp = p.reduce((s, v) => s + v, 0) / p.length, mq = q.reduce((s, v) => s + v, 0) / q.length; return p.reduce((s, v, i) => s + (v - mp) * (q[i] - mq), 0); };
ok("just-identified 2SLS is cov(z,y)/cov(z,x)", near(iv.coef[1], cov(z, yi) / cov(z, xe), 8) && iv.firstStageF[0] > 10, `${show(iv.coef[1])} F ${show(iv.firstStageF[0])}`);
const sm = surveyMean([10, 20, 30], [1, 2, 3]);
ok("a weighted mean is 140/6", near(sm.mean, 140 / 6), show(sm.mean));
const smd = surveyMean([10, 20, 30, 40], [1, 1, 1, 1], { strata: ["s", "s", "t", "t"], psu: [1, 2, 3, 4] });
ok("a stratified design's variance sums over strata", smd.mean === 25 && smd.se > 0, show(smd.se));

/* ---- finance ---- */
const rs = returns([100, 110, 99]);
ok("simple returns", near(rs[0], 0.1, 8) && near(rs[1], -0.1, 8));
ok("log returns", near(returns([100, 110], true)[0], Math.log(1.1), 8));
const rm = [0.01, -0.02, 0.03, 0.005, -0.01];
const ri = rm.map((v) => 0.002 + 1.5 * v);
const cp = capm(ri, rm);
ok("CAPM beta 1.5 and alpha 0.002 on exact data", near(cp.coef[1], 1.5, 8) && near(cp.coef[0], 0.002, 8));
ok("Sharpe: mean over sd, annualised", near(sharpe([0.01, 0.02, 0.03], 0, 252), (0.02 / 0.01) * Math.sqrt(252)));
const R = [[0.02, 0.04], [0.01, 0.02], [0.03, 0.06]];
const fm = famaMacBeth(R, [[0.02], [0.01], [0.03]], ["mkt"]);
ok("Fama-MacBeth on returns that are exactly beta times the factor", fm.betas[0][0] > 0 && fm.periods === 3 && fm.lambda.length === 2, JSON.stringify(fm.lambda));
const cs = csad([[0.01, 0.03], [0.02, 0.02], [-0.01, 0.03], [0, 0.01], [-0.03, -0.01]], [0.02, -0.01, 0.03, 0.005, -0.02]);
ok("CSAD is the mean absolute deviation from the market each period", near(cs.csad[0], 0.01, 8) && near(cs.csad[1], 0.03, 8) && near(cs.csad[2], 0.02, 8) && near(cs.csad[3], 0.005, 8) && cs.fit.names[2] === "Rm²", cs.csad.map(show).join(" "));
const mkt = Array.from({ length: 30 }, (_v, i) => Math.sin(i) / 100);
const stock = mkt.map((v, i) => (i >= 20 && i <= 22 ? v + 0.02 : v));
const es = eventStudyReturns(stock, mkt, 21, [-20, -5], [-1, 1]);
ok("event study: alpha 0, beta 1, AR 0.02 a day, CAR 0.06", near(es.beta, 1, 6) && near(es.alpha, 0, 6) && near(es.car, 0.06, 6) && es.days.length === 3, `${show(es.beta)} ${show(es.car)}`);
ok("historical VaR at 95% of twenty returns is the second-worst by interpolation", near(historicalVaR(Array.from({ length: 20 }, (_v, i) => -0.05 + i * 0.005), 0.95), 0.04525, 5), show(historicalVaR(Array.from({ length: 20 }, (_v, i) => -0.05 + i * 0.005), 0.95)));
let seed = 7;
const rand = (): number => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 - 0.5; };
const noise = Array.from({ length: 300 }, rand);
const walk = noise.reduce<number[]>((acc, e) => [...acc, (acc[acc.length - 1] ?? 0) + e], []);
const ar1 = noise.reduce<number[]>((acc, e) => [...acc, 0.3 * (acc[acc.length - 1] ?? 0) + e], []);
ok("ADF calls a random walk non-stationary and an AR(1) stationary", !adf(walk, 2).stationary && adf(ar1, 2).stationary, `${show(adf(walk, 2).statistic)} ${show(adf(ar1, 2).statistic)}`);

/* ---- agriculture and climate ---- */
ok("degree days: (30+20)/2 - 10 = 15, capped at 30", degreeDays([30, 40], [20, 30])[0] === 15 && degreeDays([30, 40], [20, 30])[1] === 20);
const sh = rainfallShock([100, 200, 300]);
ok("rainfall shock: z of the mean is 0 and of the extremes ±1", near(sh.z[1], 0, 8) && near(sh.z[0], -1, 8) && near(sh.z[2], 1, 8));
const ins = indexInsurance([100, 50, 200, 80], { trigger: 90, exit: 40, maxPayout: 1000 }, [0, 900, 0, 0]);
ok("index insurance: payouts 0, 800, 0, 200 and a fair premium of 250, loaded 312.5",
  near(ins.payouts[1], 800) && near(ins.payouts[3], 200) && near(ins.fairPremium, 250) && near(ins.loadedPremium, 312.5), JSON.stringify(ins.payouts));
ok("and basis risk counts the season paid with no loss", ins.missedLosses === 0 && ins.falsePayouts === 1 && ins.basisCorrelation !== null && ins.basisCorrelation > 0.9, `${ins.falsePayouts} ${ins.basisCorrelation}`);
const mv = meanVariance([{ name: "rice", outcomes: [10, 20, 30] }]);
ok("mean-variance: mean 20, sd 10, cv 0.5", near(mv[0].mean, 20) && near(mv[0].sd, 10) && near(mv[0].cv, 0.5));
ok("stochastic dominance: [1,2,3] dominates [0,1,2] at first order", stochasticDominance([1, 2, 3], [0, 1, 2]).first && !stochasticDominance([0, 1, 2], [1, 2, 3]).first);
ok("and a mean-preserving spread is dominated at second order only", !stochasticDominance([2, 2, 2], [1, 2, 3]).first && stochasticDominance([2, 2, 2], [1, 2, 3]).second);

/* ---- several fits side by side, and a run against the paper ---- */
const fitA = { names: ["(Intercept)", "open"], coef: [1.23456, 0.5], se: [0.1, 0.02], p: [0.0001, 0.03], n: 12, r2: 0.5, adjR2: 0.4, robust: "HC1" };
const fitB = { names: ["(Intercept)", "open", "volume"], coef: [2, 0.4, -0.001], se: [1, 0.05, 0.0004], p: [0.2, 0.001, 0.02], n: 12, r2: 0.6, adjR2: 0.5, robust: "cluster", clusters: 4 };
const cmp = compareRuns([{ label: "one", depvar: "close", fit: fitA }, { label: "two", depvar: "close", fit: fitB }]);
ok("compareRuns: a column a model and the terms in order of first appearance", cmp.rows[0].join("|") === "|(1) close|(2) close" && cmp.rows.map((r) => r[0]).filter(Boolean).join(",") === "(Intercept),open,volume,N,R²", cmp.rows.map((r) => r[0]).join(","));
ok("compareRuns: the coefficient with its stars and the SE in brackets beneath", cmp.rows[1].join("|") === "(Intercept)|1.235***|2.000" && cmp.rows[2].join("|") === "|(0.100)|(1.000)", `${cmp.rows[1].join("|")} / ${cmp.rows[2].join("|")}`);
ok("compareRuns: a term one model lacks is a blank cell in that column", cmp.rows[5].join("|") === "volume||-0.001*" && cmp.rows[6].join("|") === "||(0.000)", `${cmp.rows[5].join("|")} / ${cmp.rows[6].join("|")}`);
ok("compareRuns: N and R squared in the foot", cmp.rows[7].join("|") === "N|12|12" && cmp.rows[8].join("|") === "R²|0.500|0.600");
ok("compareRuns: the note names each column's errors where they differ", cmp.notes.includes("(1) heteroskedasticity-robust (HC1)") && cmp.notes.includes("(2) clustered by group (4 clusters)") && cmp.notes.includes("*** p < .001"), cmp.notes);
ok("compareRuns: Markdown and LaTeX carry the same rows", cmp.markdown.includes("| open | 0.500* | 0.400** |") && cmp.latex.includes("open & 0.500* & 0.400** \\\\") && cmp.latex.startsWith("\\begin{tabular}{lll}"), cmp.latex.slice(0, 120));
const noStars = compareRuns([{ label: "one", fit: fitA }], { stars: false });
ok("compareRuns: with stars off nothing is starred and the note says nothing about p", !/\*/.test(noStars.rows.flat().join("")) && !noStars.notes.includes("p <"));
const logitLike = { names: ["(Intercept)", "x"], coef: [0.1, 0.2], se: [0.1, 0.1], p: [0.3, 0.05], n: 40, r2: 0, adjR2: 0, pseudoR2: 0.12, robust: "classical" };
const mixed = compareRuns([{ label: "ols", fit: fitA }, { label: "logit", fit: logitLike }]);
ok("compareRuns: a pseudo R squared is its own row and a logit leaves the R squared cell blank", mixed.rows.some((r) => r.join("|") === "R²|0.500|") && mixed.rows.some((r) => r.join("|") === "Pseudo R²||0.120"), mixed.rows.slice(-2).map((r) => r.join("|")).join(" / "));
const fromRun = modelOf({ label: "OLS: close, open", input: { method: "ols", roles: { y: ["close"], x: ["open"] } }, output: { fit: fitA } });
ok("modelOf reads a stored fit and the outcome out of the run's roles", fromRun?.depvar === "close" && fromRun.fit.coef[1] === 0.5 && fromRun.fit.n === 12);
const fmb = modelOf({ label: "Fama-MacBeth", input: { method: "famamacbeth", roles: {} }, output: { summary: "60 periods, 5 assets", tables: [{ title: "Risk premia", columns: ["factor", "lambda", "se", "t"], rows: [["(Intercept)", 0.01, 0.005, 2], ["mkt", 0.05, 0.01, 5]] }] } });
ok("modelOf reads a Fama-MacBeth run out of its premia table with the periods as N", fmb?.fit.names.join(",") === "(Intercept),mkt" && fmb.fit.n === 60 && near(fmb.fit.p[0], 2 * (1 - normalCdf(2)), 8) && fmb.fit.robust === "Fama-MacBeth", JSON.stringify(fmb));
ok("modelOf is null for a run that is not a regression", modelOf({ label: "sql", input: {}, output: { columns: ["a"], rows: [[1]] } }) === null);
const gap = paperGap(0.5, 0.02, 0.52, 0.03, 10);
ok("paperGap: the difference, in this run's SEs and in the paper's", near(gap.diff, -0.02) && near(gap.inSe, -1) && near(gap.inPaperSe ?? 0, -2 / 3), JSON.stringify(gap));
ok("paperGap: a t interval on 10 df is ±2.228 SEs and the paper's figure is inside it", near(gap.ci[0], 0.5 - 2.2281 * 0.02, 4) && near(gap.ci[1], 0.5 + 2.2281 * 0.02, 4) && gap.inside, JSON.stringify(gap.ci));
ok("paperGap: a normal interval with no df, and a figure outside it", (() => { const g = paperGap(0.5, 0.02, 0.6, null); return near(g.ci[1], 0.5 + 1.96 * 0.02, 4) && !g.inside && g.inPaperSe === null; })());
ok("agreesToPrecision compares what the table prints, not the float", agreesToPrecision(0.12345, 0.12349) && !agreesToPrecision(0.1234, 0.1236) && !agreesToPrecision(NaN, 1));

console.log(`research-stats: ${passed} checks passed${failures.length ? `, ${failures.length} failed` : ""}`);
for (const f2 of failures) console.log(`  x ${f2}`);
if (failures.length) process.exit(1);
