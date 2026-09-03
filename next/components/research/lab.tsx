"use client";

/* ============================================================
   research/lab.tsx: the lab. RESEARCH.md section 14, and the
   campaign's additions in 36.

   A dataset is a file in R2 and a library source of type dataset,
   read into DuckDB in the browser (lib/duck.ts) the first time it
   is asked for and never through the Worker after the upload. Its
   dictionary is one row a column, bound to the questions room's
   variables. SQL is a transform, saved. Every statistic is a
   METHOD in the table below, which is what makes the form one
   form: a method declares the roles it needs (an outcome, some
   regressors, a group), the options it takes, and how to answer,
   and the run records exactly those, so a result can be re-run.
   Every answer is a run: the kind, the inputs, the code, the hash
   of the data, the output whole, and the figure as SVG text.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { toneVar } from "@reiad/shared/research";
import {
  COLUMN_TYPES, apaTable, canonicalColumns, chartSvg, compareRuns, completeCases, dayOf, hashText, histogram, importerFor, inferColumns, modelOf, parseDelimited, sanity,
  type Cell, type ChartOptions, type Column, type ColumnType, type Sanity, type Series, type Table,
} from "@reiad/shared/research-lab";
import {
  adf, anova, capm, chiSquare, correlation, csad, degreeDays, describe, did, eventStudyReturns, expectedShortfall, factorRegression, famaMacBeth, glm,
  historicalVaR, indexInsurance, mannWhitney, meanVariance, ols, panelFE, rainfallShock, returns, sharpe, sortino, spearman, stochasticDominance,
  surveyMean, tTest, tsls, type Fit, type Robust,
} from "@reiad/shared/research-stats";
import {
  addDataset, addRun, addSource, addTransform, climateSeries, fileTicket, findPlaces, listDatasets, listQuestions, listRuns, listTransforms, marketSeries, removeDataset, removeRun,
  removeTransform, saveDataset, uploadFile, type ClimateSeries, type Dataset, type PlaceFound, type Question, type Run, type Transform, type Who,
} from "../../lib/research-api";
import { ident, loadTable, query, type Answer } from "../../lib/duck";
import { Button, ButtonLabel } from "../ui/button";
import { Chip, ChipButton } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";
import { useKeys } from "./keys";

type View = "datasets" | "sql" | "stats" | "charts" | "runs" | "market" | "climate";
const VIEWS: View[] = ["datasets", "sql", "stats", "charts", "runs", "market", "climate"];
const ACCEPT = ".csv,.tsv,.txt,.xlsx,.parquet,.json";
const TEXT_EXT = new Set(["csv", "tsv", "txt", "json"]);

const slug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40) || "data";
const tableOf = (d: Dataset): string => `${slug(d.name)}_${d.id.replace(/-/g, "").slice(0, 6)}`;
const fmt = (v: unknown, digits = 4): string => (typeof v === "number" ? (Number.isInteger(v) ? String(v) : v.toFixed(digits)) : v === null || v === undefined ? "" : String(v));
const svgUrl = (svg: string): string => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const kb = (n: number): string => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

function download(name: string, body: string, type: string): void {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- the methods, as data ---------- */

interface Role { key: string; en: string; bn: string; many?: boolean; kind: "number" | "any"; optional?: boolean }
interface Option { key: string; en: string; bn: string; choices?: string[]; value: string }
interface Picked { num: (key: string) => number[]; nums: (key: string) => number[][]; any: (key: string) => Cell[]; names: (key: string) => string[] }
export interface OutTable { title: string; columns: string[]; rows: Cell[][] }
export interface Result { tables: OutTable[]; fit?: Fit & { pseudoR2?: number; link?: string; firstStageF?: number[] }; chart?: ChartOptions; summary: string }
interface Method { id: string; en: string; bn: string; group: string; roles: Role[]; options: Option[]; run: (p: Picked, o: Record<string, string>) => Result }

const num = (key: string, en: string, bn: string, extra: Partial<Role> = {}): Role => ({ key, en, bn, kind: "number", ...extra });
const any = (key: string, en: string, bn: string, extra: Partial<Role> = {}): Role => ({ key, en, bn, kind: "any", ...extra });
const opt = (key: string, en: string, bn: string, value: string, choices?: string[]): Option => ({ key, en, bn, value, choices });

const fitTable = (fit: Fit, title: string): OutTable => ({
  title, columns: ["term", "coef", "se", "t", "p"],
  rows: fit.names.map((n, i) => [n, fit.coef[i], fit.se[i], fit.t[i], fit.p[i]]),
});
const fitSummary = (fit: Fit): string => `N = ${fit.n}, R² = ${fit.r2.toFixed(3)}, ${fit.robust} errors${fit.clusters ? `, ${fit.clusters} clusters` : ""}`;
const residualChart = (fit: Fit): ChartOptions => ({ kind: "scatter", series: [{ name: "residuals", points: fit.fitted.map((f, i) => ({ x: f, y: fit.residuals[i] })) }], xLabel: "fitted", yLabel: "residual" });
const levels = (col: Cell[]): string[] => [...new Set(col.map((v) => String(v)))].sort();
const groupsOf = (y: number[], g: Cell[]): { names: string[]; groups: number[][] } => {
  const names = levels(g);
  return { names, groups: names.map((n) => y.filter((_v, i) => String(g[i]) === n)) };
};
const lineOf = (name: string, ys: number[]): Series => ({ name, points: ys.map((y, i) => ({ x: i, y })) });

export const METHODS: Method[] = [
  {
    id: "describe", en: "Descriptive statistics", bn: "বর্ণনামূলক পরিসংখ্যান", group: "describe",
    roles: [num("x", "Columns", "কলাম", { many: true })], options: [],
    run: (p) => {
      const names = p.names("x"), cols = p.nums("x");
      const rows = names.map((n, i) => { const d = describe(cols[i]); return [n, d.n, d.missing, d.mean, d.sd, d.min, d.q1, d.median, d.q3, d.max, d.skew, d.kurtosis]; });
      return { tables: [{ title: "Descriptives", columns: ["column", "n", "missing", "mean", "sd", "min", "q1", "median", "q3", "max", "skew", "kurtosis"], rows }], chart: { kind: "hist", series: [histogram(cols[0])], xLabel: names[0], yLabel: "count" }, summary: `${names.length} column(s), n = ${cols[0].length}` };
    },
  },
  {
    id: "correlation", en: "Correlation matrix", bn: "সহসম্পর্ক ছক", group: "describe",
    roles: [num("x", "Columns", "কলাম", { many: true })], options: [opt("method", "Method", "পদ্ধতি", "pearson", ["pearson", "spearman"])],
    run: (p, o) => {
      const names = p.names("x"), cols = p.nums("x");
      const m = o.method === "spearman" ? names.map((_a, i) => names.map((_b, j) => (i === j ? 1 : spearman(cols[i], cols[j])))) : correlation(cols);
      return { tables: [{ title: `${o.method} correlation`, columns: ["", ...names], rows: names.map((n, i) => [n, ...m[i]]) }], summary: `${names.length} columns, n = ${cols[0].length}` };
    },
  },
  {
    id: "ttest", en: "t test (Welch)", bn: "t পরীক্ষা (Welch)", group: "test",
    roles: [num("y", "Outcome", "ফলাফল"), any("group", "Group (two levels)", "দল (দুটি স্তর)")], options: [],
    run: (p) => {
      const { names, groups } = groupsOf(p.num("y"), p.any("group"));
      if (groups.length !== 2) throw new Error("two groups needed");
      const t = tTest(groups[0], groups[1]);
      return { tables: [{ title: "Welch t test", columns: ["statistic", "value"], rows: [["t", t.t], ["df", t.df], ["p", t.p], [`mean ${names[0]}`, t.meanA], [`mean ${names[1]}`, t.meanB], ["difference", t.diff], ["se", t.se], ["ci low", t.ci[0]], ["ci high", t.ci[1]]] }],
        chart: { kind: "bar", series: [{ name: "mean", points: [{ x: 0, y: t.meanA }, { x: 1, y: t.meanB }] }], categories: names, yLabel: "mean" }, summary: `t = ${t.t.toFixed(3)}, p = ${t.p.toFixed(4)}` };
    },
  },
  {
    id: "anova", en: "One-way ANOVA", bn: "একমুখী ANOVA", group: "test",
    roles: [num("y", "Outcome", "ফলাফল"), any("group", "Group", "দল")], options: [],
    run: (p) => {
      const { names, groups } = groupsOf(p.num("y"), p.any("group"));
      const a = anova(groups);
      return { tables: [{ title: "ANOVA", columns: ["statistic", "value"], rows: [["F", a.f], ["df1", a.df1], ["df2", a.df2], ["p", a.p], ["SS between", a.ssBetween], ["SS within", a.ssWithin]] }, { title: "Group means", columns: ["group", "mean", "n"], rows: names.map((n, i) => [n, a.means[i], groups[i].length]) }],
        chart: { kind: "bar", series: [{ name: "mean", points: a.means.map((m, i) => ({ x: i, y: m })) }], categories: names, yLabel: "mean" }, summary: `F(${a.df1}, ${a.df2}) = ${a.f.toFixed(3)}, p = ${a.p.toFixed(4)}` };
    },
  },
  {
    id: "chisq", en: "Chi-square test of independence", bn: "কাই-বর্গ স্বাধীনতা পরীক্ষা", group: "test",
    roles: [any("a", "Rows", "সারি"), any("b", "Columns", "কলাম")], options: [],
    run: (p) => {
      const a = p.any("a"), b = p.any("b");
      const ra = levels(a), rb = levels(b);
      const table = ra.map((x) => rb.map((y) => a.filter((v, i) => String(v) === x && String(b[i]) === y).length));
      const c = chiSquare(table);
      return { tables: [{ title: "Observed", columns: ["", ...rb], rows: ra.map((x, i) => [x, ...table[i]]) }, { title: "Chi-square", columns: ["statistic", "value"], rows: [["chi²", c.chi2], ["df", c.df], ["p", c.p]] }], summary: `χ²(${c.df}) = ${c.chi2.toFixed(3)}, p = ${c.p.toFixed(4)}` };
    },
  },
  {
    id: "mannwhitney", en: "Mann-Whitney U", bn: "Mann-Whitney U", group: "test",
    roles: [num("y", "Outcome", "ফলাফল"), any("group", "Group (two levels)", "দল (দুটি স্তর)")], options: [],
    run: (p) => {
      const { groups } = groupsOf(p.num("y"), p.any("group"));
      if (groups.length !== 2) throw new Error("two groups needed");
      const m = mannWhitney(groups[0], groups[1]);
      return { tables: [{ title: "Mann-Whitney", columns: ["statistic", "value"], rows: [["U", m.u], ["z", m.z], ["p", m.p]] }], summary: `U = ${m.u}, p = ${m.p.toFixed(4)}` };
    },
  },
  {
    id: "ols", en: "OLS regression", bn: "OLS রিগ্রেশন", group: "regression",
    roles: [num("y", "Outcome", "ফলাফল"), num("x", "Regressors", "ব্যাখ্যাকারী", { many: true }), any("cluster", "Cluster by", "ক্লাস্টার", { optional: true })],
    options: [opt("robust", "Standard errors", "মান ত্রুটি", "HC1", ["classical", "HC0", "HC1", "HC3", "cluster"])],
    run: (p, o) => {
      const cluster = p.any("cluster");
      const robust = (cluster.length ? "cluster" : o.robust) as Robust;
      const fit = ols(p.num("y"), transposeCols(p.nums("x")), p.names("x"), { robust, cluster: cluster.length ? cluster.map(String) : undefined });
      return { tables: [fitTable(fit, "OLS")], fit, chart: residualChart(fit), summary: fitSummary(fit) };
    },
  },
  {
    id: "logit", en: "Logistic regression", bn: "লজিস্টিক রিগ্রেশন", group: "regression",
    roles: [num("y", "Outcome (0/1)", "ফলাফল (০/১)"), num("x", "Regressors", "ব্যাখ্যাকারী", { many: true })], options: [opt("link", "Link", "লিংক", "logit", ["logit", "probit"])],
    run: (p, o) => {
      const fit = glm(p.num("y"), transposeCols(p.nums("x")), p.names("x"), o.link === "probit" ? "probit" : "logit");
      return { tables: [fitTable(fit, o.link)], fit, summary: `N = ${fit.n}, log-likelihood ${fit.logLik.toFixed(3)}, pseudo R² ${fit.pseudoR2.toFixed(3)}` };
    },
  },
  {
    id: "panelfe", en: "Panel fixed effects", bn: "প্যানেল স্থির প্রভাব", group: "panel",
    roles: [num("y", "Outcome", "ফলাফল"), num("x", "Regressors", "ব্যাখ্যাকারী", { many: true }), any("entity", "Entity", "একক"), any("time", "Time", "সময়", { optional: true })],
    options: [opt("robust", "Standard errors", "মান ত্রুটি", "cluster", ["cluster", "HC1", "classical"])],
    run: (p, o) => {
      const time = p.any("time");
      const fit = panelFE(p.num("y"), transposeCols(p.nums("x")), p.names("x"), p.any("entity").map(String), { time: time.length ? time.map(String) : undefined, robust: o.robust as Robust });
      return { tables: [fitTable(fit, "Fixed effects")], fit, chart: residualChart(fit), summary: `${fitSummary(fit)}, ${fit.extra?.entities ?? 0} entities` };
    },
  },
  {
    id: "did", en: "Difference in differences", bn: "পার্থক্যের পার্থক্য", group: "panel",
    roles: [num("y", "Outcome", "ফলাফল"), num("treat", "Treated (0/1)", "চিকিৎসিত (০/১)"), num("post", "Post (0/1)", "পরে (০/১)"), num("controls", "Controls", "নিয়ন্ত্রক", { many: true, optional: true }), any("cluster", "Cluster by", "ক্লাস্টার", { optional: true })],
    options: [],
    run: (p) => {
      const cluster = p.any("cluster");
      const fit = did(p.num("y"), p.num("treat"), p.num("post"), transposeCols(p.nums("controls")), p.names("controls"), { robust: cluster.length ? "cluster" : "HC1", cluster: cluster.length ? cluster.map(String) : undefined });
      return { tables: [fitTable(fit, "Difference in differences")], fit, summary: `treat:post = ${fit.coef[3].toFixed(4)} (se ${fit.se[3].toFixed(4)}), ${fitSummary(fit)}` };
    },
  },
  {
    id: "tsls", en: "Two-stage least squares", bn: "দুই-ধাপ ন্যূনতম বর্গ", group: "regression",
    roles: [num("y", "Outcome", "ফলাফল"), num("endog", "Endogenous", "অন্তর্জাত", { many: true }), num("exog", "Exogenous controls", "বহির্জাত নিয়ন্ত্রক", { many: true, optional: true }), num("z", "Instruments", "উপকরণ", { many: true })],
    options: [opt("robust", "Standard errors", "মান ত্রুটি", "HC1", ["HC1", "classical"])],
    run: (p, o) => {
      const fit = tsls(p.num("y"), transposeCols(p.nums("endog")), transposeCols(p.nums("exog"), p.num("y").length), transposeCols(p.nums("z")), { endog: p.names("endog"), exog: p.names("exog") }, { robust: o.robust as Robust });
      return { tables: [fitTable(fit, "2SLS"), { title: "First stage F", columns: ["endogenous", "F"], rows: p.names("endog").map((n, i) => [n, fit.firstStageF[i]]) }], fit, summary: `${fitSummary(fit)}, first-stage F ${fit.firstStageF.map((f) => f.toFixed(1)).join(", ")}` };
    },
  },
  {
    id: "surveymean", en: "Survey-weighted mean", bn: "জরিপ-ভারিত গড়", group: "describe",
    roles: [num("x", "Variable", "চলক"), num("w", "Weight", "ওজন"), any("strata", "Strata", "স্তর", { optional: true }), any("psu", "Primary sampling unit", "প্রাথমিক নমুনা একক", { optional: true })], options: [],
    run: (p) => {
      const strata = p.any("strata"), psu = p.any("psu");
      const m = surveyMean(p.num("x"), p.num("w"), { strata: strata.length ? strata.map(String) : undefined, psu: psu.length ? psu.map(String) : undefined });
      return { tables: [{ title: "Survey mean", columns: ["statistic", "value"], rows: [["mean", m.mean], ["se", m.se], ["n", m.n], ["sum of weights", m.sumWeights]] }], summary: `mean ${m.mean.toFixed(4)} (se ${m.se.toFixed(4)})` };
    },
  },
  {
    id: "capm", en: "CAPM beta", bn: "CAPM বিটা", group: "finance",
    roles: [num("r", "Asset", "সম্পদ"), num("m", "Market", "বাজার"), num("rf", "Risk-free", "ঝুঁকিমুক্ত", { optional: true })], options: [opt("input", "Series are", "ধারা হলো", "returns", ["returns", "prices"])],
    run: (p, o) => {
      const toR = (s: number[]): number[] => (o.input === "prices" ? returns(s) : s);
      const r = toR(p.num("r")), m = toR(p.num("m"));
      const rf = p.num("rf");
      const fit = capm(r, m, rf.length ? (o.input === "prices" ? rf.slice(1) : rf) : 0);
      return { tables: [fitTable(fit, "CAPM")], fit, chart: { kind: "scatter", series: [{ name: "asset on market", points: m.map((x, i) => ({ x, y: r[i] })) }], xLabel: "market", yLabel: "asset" }, summary: `beta ${fit.coef[1].toFixed(4)}, alpha ${fit.coef[0].toFixed(5)}` };
    },
  },
  {
    id: "risk", en: "Sharpe, Sortino and VaR", bn: "Sharpe, Sortino ও VaR", group: "finance",
    roles: [num("r", "Returns", "রিটার্ন")], options: [opt("periods", "Periods a year", "বছরে সময়কাল", "252"), opt("rf", "Risk-free a period", "ঝুঁকিমুক্ত হার", "0"), opt("level", "VaR level", "VaR স্তর", "0.95")],
    run: (p, o) => {
      const r = p.num("r"), periods = Number(o.periods) || 252, rf = Number(o.rf) || 0, level = Number(o.level) || 0.95;
      const d = describe(r);
      return { tables: [{ title: "Risk", columns: ["statistic", "value"], rows: [["mean", d.mean], ["sd", d.sd], ["Sharpe", sharpe(r, rf, periods)], ["Sortino", sortino(r, rf, periods)], [`VaR ${level}`, historicalVaR(r, level)], [`expected shortfall ${level}`, expectedShortfall(r, level)], ["skew", d.skew], ["kurtosis", d.kurtosis]] }], chart: { kind: "hist", series: [histogram(r, 30)], xLabel: "return", yLabel: "count" }, summary: `Sharpe ${sharpe(r, rf, periods).toFixed(3)}` };
    },
  },
  {
    id: "adf", en: "ADF unit root test", bn: "ADF একক মূল পরীক্ষা", group: "finance",
    roles: [num("x", "Series", "ধারা")], options: [opt("lags", "Lags", "ল্যাগ", "1"), opt("trend", "Deterministics", "নির্ধারক", "c", ["n", "c", "ct"])],
    run: (p, o) => {
      const a = adf(p.num("x"), Number(o.lags) || 0, o.trend as "n" | "c" | "ct");
      return { tables: [{ title: "ADF", columns: ["statistic", "value"], rows: [["statistic", a.statistic], ["1%", a.critical["1%"]], ["5%", a.critical["5%"]], ["10%", a.critical["10%"]], ["lags", a.lags], ["stationary at 5%", a.stationary ? "yes" : "no"]] }], chart: { kind: "line", series: [lineOf("series", p.num("x"))], yLabel: "value" }, summary: `ADF ${a.statistic.toFixed(3)}, ${a.stationary ? "rejects" : "does not reject"} a unit root at 5%` };
    },
  },
  {
    id: "eventstudy", en: "Event study (market model)", bn: "ঘটনা অধ্যয়ন (বাজার মডেল)", group: "finance",
    roles: [num("r", "Asset returns", "সম্পদের রিটার্ন"), num("m", "Market returns", "বাজারের রিটার্ন")],
    options: [opt("event", "Event row (0-based)", "ঘটনার সারি (০ থেকে)", "0"), opt("est", "Estimation window", "অনুমান জানালা", "-120,-21"), opt("win", "Event window", "ঘটনা জানালা", "-5,5")],
    run: (p, o) => {
      const pair = (s: string): [number, number] => { const [a, b] = s.split(",").map(Number); return [a, b]; };
      const e = eventStudyReturns(p.num("r"), p.num("m"), Number(o.event) || 0, pair(o.est), pair(o.win));
      return { tables: [{ title: "Abnormal returns", columns: ["day", "AR"], rows: e.days.map((d, i) => [d, e.ar[i]]) }, { title: "Event study", columns: ["statistic", "value"], rows: [["alpha", e.alpha], ["beta", e.beta], ["CAR", e.car], ["se", e.se], ["t", e.t]] }], chart: { kind: "bar", series: [{ name: "AR", points: e.days.map((d, i) => ({ x: d, y: e.ar[i] })) }], categories: e.days.map(String), yLabel: "abnormal return" }, summary: `CAR ${e.car.toFixed(4)} (t ${e.t.toFixed(2)})` };
    },
  },
  {
    id: "csad", en: "Herding (CSAD)", bn: "হার্ডিং (CSAD)", group: "finance",
    roles: [num("m", "Market return", "বাজারের রিটার্ন"), num("assets", "Asset returns", "সম্পদের রিটার্ন", { many: true })], options: [],
    run: (p) => {
      const c = csad(transposeCols(p.nums("assets")), p.num("m"));
      return { tables: [fitTable(c.fit, "CSAD on |Rm| and Rm²")], fit: c.fit, chart: { kind: "line", series: [lineOf("CSAD", c.csad)], yLabel: "CSAD" }, summary: `Rm² = ${c.fit.coef[2].toFixed(5)} (${c.fit.coef[2] < 0 ? "herding" : "no herding"})` };
    },
  },
  {
    id: "famamacbeth", en: "Fama-MacBeth", bn: "Fama-MacBeth", group: "finance",
    roles: [num("assets", "Asset returns", "সম্পদের রিটার্ন", { many: true }), num("factors", "Factors", "ফ্যাক্টর", { many: true })], options: [],
    run: (p) => {
      const f = famaMacBeth(transposeCols(p.nums("assets")), transposeCols(p.nums("factors")), p.names("factors"));
      return { tables: [{ title: "Risk premia", columns: ["factor", "lambda", "se", "t"], rows: f.names.map((n, i) => [n, f.lambda[i], f.se[i], f.t[i]]) }], summary: `${f.periods} periods, ${p.names("assets").length} assets` };
    },
  },
  {
    id: "factors", en: "Factor regression", bn: "ফ্যাক্টর রিগ্রেশন", group: "finance",
    roles: [num("r", "Excess return", "অতিরিক্ত রিটার্ন"), num("f", "Factors", "ফ্যাক্টর", { many: true })], options: [opt("robust", "Standard errors", "মান ত্রুটি", "HC1", ["HC1", "classical", "HC3"])],
    run: (p, o) => { const fit = factorRegression(p.num("r"), transposeCols(p.nums("f")), p.names("f"), o.robust as Robust); return { tables: [fitTable(fit, "Factor regression")], fit, summary: fitSummary(fit) }; },
  },
  {
    id: "degreedays", en: "Growing degree days", bn: "বৃদ্ধি ডিগ্রি দিন", group: "climate",
    roles: [num("tmax", "Daily maximum", "দৈনিক সর্বোচ্চ"), num("tmin", "Daily minimum", "দৈনিক সর্বনিম্ন")], options: [opt("base", "Base °C", "ভিত্তি °C", "10"), opt("cap", "Cap °C", "সীমা °C", "30")],
    run: (p, o) => {
      const dd = degreeDays(p.num("tmax"), p.num("tmin"), Number(o.base), Number(o.cap));
      const total = dd.reduce((a, b) => a + b, 0);
      return { tables: [{ title: "Degree days", columns: ["statistic", "value"], rows: [["days", dd.length], ["total", total], ["mean a day", total / dd.length]] }], chart: { kind: "line", series: [lineOf("degree days", dd)], yLabel: "degree days" }, summary: `${total.toFixed(1)} degree days over ${dd.length} days` };
    },
  },
  {
    id: "rainfall", en: "Rainfall shock", bn: "বৃষ্টিপাতের ধাক্কা", group: "climate",
    roles: [num("x", "Seasonal rainfall", "মৌসুমি বৃষ্টি")], options: [],
    run: (p) => {
      const s = rainfallShock(p.num("x"));
      return { tables: [{ title: "Standardised anomaly", columns: ["season", "rain", "anomaly", "z"], rows: s.z.map((z, i) => [i + 1, p.num("x")[i], s.anomaly[i], z]) }], chart: { kind: "bar", series: [lineOf("z", s.z)], yLabel: "z" }, summary: `mean ${s.mean.toFixed(1)}, sd ${s.sd.toFixed(1)}` };
    },
  },
  {
    id: "insurance", en: "Weather index insurance", bn: "আবহাওয়া সূচক বিমা", group: "climate",
    roles: [num("index", "Index by season", "মৌসুমি সূচক"), num("loss", "Loss by season", "মৌসুমি ক্ষতি", { optional: true })],
    options: [opt("trigger", "Trigger", "ট্রিগার", "0"), opt("exit", "Exit", "এক্সিট", "0"), opt("max", "Maximum payout", "সর্বোচ্চ পরিশোধ", "1000"), opt("loading", "Loading", "লোডিং", "1.25")],
    run: (p, o) => {
      const loss = p.num("loss");
      const i = indexInsurance(p.num("index"), { trigger: Number(o.trigger), exit: Number(o.exit), maxPayout: Number(o.max), loading: Number(o.loading) }, loss.length ? loss : undefined);
      return { tables: [{ title: "Contract", columns: ["statistic", "value"], rows: [["expected payout", i.expectedPayout], ["fair premium", i.fairPremium], ["loaded premium", i.loadedPremium], ["basis correlation", i.basisCorrelation ?? ""], ["losses missed", i.missedLosses], ["paid with no loss", i.falsePayouts]] }, { title: "Payouts", columns: ["season", "index", "payout", "loss"], rows: i.payouts.map((v, k) => [k + 1, p.num("index")[k], v, loss[k] ?? ""]) }], chart: { kind: "bar", series: [lineOf("payout", i.payouts), ...(loss.length ? [lineOf("loss", loss)] : [])], yLabel: "amount" }, summary: `fair premium ${i.fairPremium.toFixed(2)}, loaded ${i.loadedPremium.toFixed(2)}` };
    },
  },
  {
    id: "meanvariance", en: "Mean-variance and dominance", bn: "গড়-ভেদাঙ্ক ও প্রাধান্য", group: "climate",
    roles: [num("options", "Outcome by option", "বিকল্প অনুযায়ী ফল", { many: true })], options: [],
    run: (p) => {
      const names = p.names("options"), cols = p.nums("options");
      const mv = meanVariance(names.map((n, i) => ({ name: n, outcomes: cols[i] })));
      const dom: Cell[][] = [];
      for (let a = 0; a < names.length; a++) for (let b = 0; b < names.length; b++) if (a !== b) { const d = stochasticDominance(cols[a], cols[b]); dom.push([names[a], names[b], d.first ? "first" : d.second ? "second" : "no"]); }
      return { tables: [{ title: "Mean-variance", columns: ["option", "mean", "sd", "cv", "min"], rows: mv.map((m) => [m.name, m.mean, m.sd, m.cv, m.min]) }, { title: "Stochastic dominance (row over column)", columns: ["a", "b", "dominates"], rows: dom }], chart: { kind: "bar", series: [{ name: "mean", points: mv.map((m, i) => ({ x: i, y: m.mean })) }], categories: names, yLabel: "mean" }, summary: `${names.length} options` };
    },
  },
];

/** Columns to rows, padded to `n` empty rows where nothing was
    picked, so an optional block of controls is a legal design. */
function transposeCols(cols: number[][], n = 0): number[][] {
  if (!cols.length) return Array.from({ length: n }, () => []);
  return cols[0].map((_v, i) => cols.map((c) => c[i]));
}

/* ---------- the room ---------- */

export function Lab({ openRun }: { openRun?: string } = {}) {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [view, setView] = useState<View>("datasets");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [variables, setVariables] = useState<Question[]>([]);
  const [loaded, setLoaded] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [said, setSaid] = useState("");
  const [ready, setReady] = useState(false);
  void openRun;

  useEffect(() => {
    if (!w) return;
    void (async () => {
      const [d, r, q] = await Promise.all([listDatasets(w), listRuns(w), listQuestions(w)]);
      setDatasets(d); setRuns(r); setVariables(q.filter((x) => x.kind === "variable")); setReady(true);
      /* The workshop's Which test links here with ?method=&dataset=,
         so a named dataset wins over the first and opens on stats. */
      const url = new URLSearchParams(location.search);
      const named = d.find((x) => x.id === url.get("dataset"))?.id ?? null;
      if (d.length) setChosen((c) => named ?? c ?? d[0].id);
      if (url.get("method")) setView("stats");
    })();
  }, [w]);

  const dataset = datasets.find((d) => d.id === chosen) ?? null;
  useKeys(useMemo(() => { const m: Record<string, () => void> = {}; VIEWS.forEach((v, i) => { m[String(i + 1)] = () => setView(v); }); return m; }, []), Boolean(w));

  const datasetChanged = useCallback((d: Dataset) => setDatasets((was) => was.map((x) => (x.id === d.id ? d : x))), []);

  /** The dataset in the engine, loaded on the first ask. Types
      come out of DESCRIBE where the upload could not read them. */
  const ensureLoaded = useCallback(async (d: Dataset): Promise<string> => {
    if (!w) throw new Error("signed out");
    if (loaded[d.id]) return loaded[d.id];
    setBusy(both("rs.lab.loading"));
    try {
      const name = await loadDataset(w, d);
      setLoaded((was) => ({ ...was, [d.id]: name }));
      if (!d.dictionary.length || d.rows === null) {
        const desc = await query(`DESCRIBE ${ident(name)}`);
        const count = await query(`SELECT count(*) FROM ${ident(name)}`);
        const dict: Column[] = d.dictionary.length ? d.dictionary : desc.rows.map((r) => ({ name: String(r[0]), type: duckType(String(r[1])) }));
        const r = await saveDataset(w, d, { dictionary: dict, rows: Number(count.rows[0]?.[0] ?? 0), columns: dict.length });
        if (r.ok) datasetChanged(r.row);
      }
      return name;
    } finally { setBusy(""); }
  }, [w, loaded, datasetChanged]);

  const keepRun = useCallback(async (part: Partial<Run> & { kind: Run["kind"]; label: string }): Promise<Run | null> => {
    if (!w) return null;
    const r = await addRun(w, { dataset_id: dataset?.id ?? null, project_id: dataset?.project_id ?? null, data_hash: dataset?.hash ?? "", ...part });
    if (r) { setRuns((was) => [r, ...was]); cue("saved"); setSaid(both("rs.lab.saved.run")); }
    return r;
  }, [w, dataset]);

  if (!w) return <SignedOut answered={answered} />;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map((v, i) => <ChipButton key={v} pressed={view === v} onClick={() => setView(v)}>{i + 1} {both(`rs.lab.${v}`)}</ChipButton>)}
        {dataset ? <Chip tone="accent" className="ml-auto">{dataset.name}{loaded[dataset.id] ? " · " + both("rs.lab.loaded") : ""}</Chip> : null}
      </div>
      {busy ? <p className="text-t1 text-ink-soft" role="status">{busy}</p> : said ? <p className="text-t1 text-ink-soft" role="status">{said}</p> : null}
      {view === "datasets" ? (
        <Datasets
          w={w} lang={lang} datasets={datasets} chosen={dataset} ready={ready} variables={variables} loadedName={dataset ? loaded[dataset.id] : undefined}
          onChoose={setChosen} onMade={(d) => { setDatasets((was) => [d, ...was]); setChosen(d.id); }} onChanged={datasetChanged}
          onRemoved={(d) => { setDatasets((was) => was.filter((x) => x.id !== d.id)); setChosen(null); }} ensureLoaded={ensureLoaded} keepRun={keepRun} setSaid={setSaid}
        />
      ) : null}
      {view === "sql" ? (dataset ? <Sql w={w} dataset={dataset} ensureLoaded={ensureLoaded} keepRun={keepRun} setSaid={setSaid} /> : <NoDataset />) : null}
      {view === "stats" ? (dataset ? <Stats lang={lang} dataset={dataset} ensureLoaded={ensureLoaded} keepRun={keepRun} setSaid={setSaid} /> : <NoDataset />) : null}
      {view === "charts" ? (dataset ? <Charts dataset={dataset} ensureLoaded={ensureLoaded} keepRun={keepRun} setSaid={setSaid} /> : <NoDataset />) : null}
      {view === "runs" ? <Runs w={w} lang={lang} runs={runs} datasets={datasets} onRemoved={(r) => setRuns((was) => was.filter((x) => x.id !== r.id))} setSaid={setSaid} /> : null}
      {view === "market" ? <Market w={w} onMade={(d) => { setDatasets((was) => [d, ...was]); setChosen(d.id); setView("datasets"); }} setSaid={setSaid} /> : null}
      {view === "climate" ? <Climate w={w} onMade={(d) => { setDatasets((was) => [d, ...was]); setChosen(d.id); setView("datasets"); }} setSaid={setSaid} /> : null}
    </div>
  );
}

const NoDataset = (): React.ReactNode => <p className="text-t2 text-ink-soft"><W k="rs.lab.pick" /></p>;

const duckType = (t: string): ColumnType => (/INT|DOUBLE|DECIMAL|FLOAT|HUGEINT|BIGINT|REAL/i.test(t) ? "number" : /DATE|TIME/i.test(t) ? "date" : /BOOL/i.test(t) ? "boolean" : "text");

/* ---------- datasets: the upload, the dictionary, the checks ---------- */

/** The dataset's file, fetched on its ticket and registered in the
    engine under the dataset's own table name. The dictionary's
    canonical names go on the table at creation, by position, so
    the file's own headings never reach a query. */
export async function loadDataset(w: Who, d: Dataset): Promise<string> {
  const file = d.files[0];
  if (!file) throw new Error("no file");
  const ticket = await fileTicket(w, file.key);
  if (!ticket) throw new Error("no ticket");
  const res = await fetch(ticket);
  if (!res.ok) throw new Error(`http-${res.status}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  const name = tableOf(d);
  await loadTable(name, bytes, file.ext, d.dictionary.map((c) => c.name));
  return name;
}

/** What a statistics run records of what was asked, and what a
    re-run reads back. */
export interface StatInput { method: string; roles: Record<string, string[]>; options: Record<string, string>; stars?: boolean }

/** One method on the columns its roles name, read out of the
    loaded table. The same function serves the form and "Run
    again", which is what makes a re-run the same computation
    rather than a second copy of it. */
export async function runStored(table: string, input: StatInput): Promise<{ result: Result; code: string; method: Method; ms: number }> {
  const method = METHODS.find((m) => m.id === input.method);
  if (!method) throw new Error(`no method ${input.method}`);
  const picks = input.roles;
  const cols = [...new Set(method.roles.flatMap((r) => picks[r.key] ?? []))];
  const code = `SELECT ${cols.map(ident).join(", ")} FROM ${ident(table)}`;
  const a = await query(code);
  const rows = a.rows.filter((r) => r.every((v) => v !== null && v !== ""));
  const col = (c: string): Cell[] => rows.map((r) => { const v = r[a.columns.indexOf(c)]; return typeof v === "boolean" ? (v ? 1 : 0) : v; });
  const p: Picked = {
    num: (k) => (picks[k]?.[0] ? col(picks[k][0]).map(Number) : []),
    nums: (k) => (picks[k] ?? []).map((c) => col(c).map(Number)),
    any: (k) => (picks[k]?.[0] ? col(picks[k][0]) : []),
    names: (k) => picks[k] ?? [],
  };
  const options = { ...Object.fromEntries(method.options.map((o) => [o.key, o.value])), ...input.options };
  const t0 = performance.now();
  const result = method.run(p, options);
  return { result, code, method, ms: Math.round(performance.now() - t0) };
}

/** The outcome a fit's table names, out of the roles. */
export const depvarOf = (roles: Record<string, string[]>): string => roles.y?.[0] ?? roles.r?.[0] ?? "y";

/** One upload is three writes and cannot half-succeed in a way
    the reader cannot see: the bytes go to R2 first, then the
    library row so the thesis can cite the file, then the dataset
    row naming both. A failure before the last leaves nothing the
    room lists. */
export async function importFile(w: Who, file: File, o: { name?: string; licence?: string; notes?: string; raw?: boolean; provenance?: Record<string, unknown> } = {}): Promise<Dataset | { error: string }> {
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  let dictionary: Column[] = [], rowsN: number | null = null, hash = "";
  if (TEXT_EXT.has(ext) && ext !== "json") {
    const text = await file.text();
    const table = parseDelimited(text, ext === "tsv" ? "\t" : undefined);
    const importer = importerFor(table.columns);
    const names = canonicalColumns(table.columns, importer);
    dictionary = inferColumns({ columns: names, rows: table.rows });
    rowsN = table.rows.length;
    hash = hashText(text);
    o.provenance = { ...(o.provenance ?? {}), importer };
  }
  const up = await uploadFile(w, file);
  if (!up.ok) return { error: up.reason };
  const name = (o.name?.trim() || file.name.replace(/\.[^.]+$/, "")).slice(0, 200);
  const source = await addSource(w, { type: "dataset", title: name, issued: { "date-parts": [[new Date().getFullYear()]] } }, { via: "manual", verified: false, why: "dataset" });
  const made = await addDataset(w, {
    name, files: [{ key: up.key, ext: up.ext || ext, size: up.size, name: file.name }], dictionary, rows: rowsN, columns: dictionary.length || null,
    hash: hash || up.key, raw: Boolean(o.raw), licence: o.licence?.trim() || null, notes: o.notes?.trim() || null, source_id: source?.id ?? null,
    provenance: { kind: "upload", original: file.name, size: up.size, date: new Date().toISOString().slice(0, 10), ...(o.provenance ?? {}) },
  });
  return made ?? { error: "row" };
}

function Datasets({ w, lang, datasets, chosen, ready, variables, loadedName, onChoose, onMade, onChanged, onRemoved, ensureLoaded, keepRun, setSaid }: {
  w: Who; lang: "en" | "bn"; datasets: Dataset[]; chosen: Dataset | null; ready: boolean; variables: Question[]; loadedName?: string;
  onChoose: (id: string) => void; onMade: (d: Dataset) => void; onChanged: (d: Dataset) => void; onRemoved: (d: Dataset) => void;
  ensureLoaded: (d: Dataset) => Promise<string>; keepRun: (part: Partial<Run> & { kind: Run["kind"]; label: string }) => Promise<Run | null>; setSaid: (s: string) => void;
}) {
  const box = useRef<HTMLInputElement>(null);
  const [licence, setLicence] = useState("");
  const [raw, setRaw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Answer | null>(null);
  const [statedN, setStatedN] = useState("");
  const [check, setCheck] = useState<Sanity | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Column>>({});
  const chosenId = chosen?.id ?? null;
  useEffect(() => { setPreview(null); setCheck(null); setDrafts({}); }, [chosenId]);

  const put = async (file: File): Promise<void> => {
    setBusy(true);
    try {
      const made = await importFile(w, file, { licence, raw });
      if ("error" in made) { setSaid(`${both("rs.lab.failed")}: ${made.error}`); return; }
      onMade(made); cue("saved"); setLicence("");
    } finally { setBusy(false); }
  };
  const load = async (): Promise<void> => {
    if (!chosen) return;
    try {
      const name = await ensureLoaded(chosen);
      setPreview(await query(`SELECT * FROM ${ident(name)} LIMIT 20`));
    } catch (e) { setSaid(`${both("rs.lab.engine.failed")}: ${String((e as Error).message ?? e)}`); }
  };
  const runSanity = async (): Promise<void> => {
    if (!chosen) return;
    try {
      const name = await ensureLoaded(chosen);
      const a = await query(`SELECT * FROM ${ident(name)} LIMIT 100000`);
      const table: Table = { columns: a.columns, rows: a.rows.map((r) => r.map((v) => (typeof v === "boolean" ? String(v) : v))) };
      const s = sanity(table, chosen.dictionary, { statedN: statedN ? Number(statedN) : null });
      setCheck(s);
      await keepRun({ kind: "check", label: `${both("rs.lab.sanity")}: ${chosen.name}`, dataset_id: chosen.id, input: { statedN: statedN ? Number(statedN) : null }, code: `SELECT * FROM ${ident(name)}`, output: s as unknown as Record<string, unknown> });
    } catch (e) { setSaid(`${both("rs.lab.engine.failed")}: ${String((e as Error).message ?? e)}`); }
  };
  const column = (c: Column): Column => drafts[c.name] ?? c;
  const keepColumn = async (c: Column): Promise<void> => {
    if (!chosen) return;
    const next = chosen.dictionary.map((x) => (x.name === c.name ? column(c) : x));
    if (JSON.stringify(next) === JSON.stringify(chosen.dictionary)) return;
    const r = await saveDataset(w, chosen, { dictionary: next });
    if (r.ok) { onChanged(r.row); cue("saved"); }
  };
  const draft = (c: Column, part: Partial<Column>): void => setDrafts((was) => ({ ...was, [c.name]: { ...column(c), ...part } }));

  return (
    <div className="rs-panes">
      <Surface material="pane" className="rs-list px-3 py-3 grid gap-3">
        <div className="grid gap-2">
          <p className="text-t1 text-ink-soft"><W k="rs.lab.upload.hint" /></p>
          <Field id="rs-lab-licence" label={<W k="rs.lab.licence" />} value={licence} onChange={(e) => setLicence(e.target.value)} autoComplete="off" />
          <label className="flex items-center gap-2 text-t1"><input type="checkbox" checked={raw} onChange={(e) => setRaw(e.target.checked)} /> <W k="rs.lab.raw" /></label>
          <ButtonLabel kind="solid" size="sm">
            <W k="rs.lab.upload" />
            <input ref={box} type="file" accept={ACCEPT} hidden disabled={busy} data-testid="rs-lab-file"
                   onChange={(e) => { const f = e.target.files?.[0]; if (f) void put(f); e.target.value = ""; }} />
          </ButtonLabel>
        </div>
        {ready && !datasets.length ? <p className="text-t1 text-ink-soft"><W k="rs.lab.empty" /></p> : null}
        <ul className="rs-rows grid gap-1">
          {datasets.map((d) => (
            <li key={d.id}>
              <button type="button" className="rs-row" aria-current={d.id === chosenId ? "true" : undefined} onClick={() => onChoose(d.id)}>
                <span className="rs-row-dot" aria-hidden="true" style={{ "--tone": toneVar("blue") } as CSSProperties} />
                <span className="rs-row-main">
                  <span className="rs-row-title">{d.name}</span>
                  <span className="rs-row-sub">{d.rows !== null ? `${d.rows} × ${d.columns ?? "?"}` : d.files[0]?.ext ?? ""}{d.raw ? ` · ${both("rs.lab.raw")}` : ""}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Surface>
      <div className="rs-main grid gap-3 min-w-0">
        {!chosen ? <NoDataset /> : (
          <>
            <Surface material="pane" className="px-4 py-3 grid gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-t3 font-medium mr-auto">{chosen.name}</h2>
                {chosen.raw ? <Chip tone="warn">{both("rs.lab.raw")}</Chip> : null}
                <Button type="button" kind="quiet" size="sm" onClick={() => { if (confirm(both("rs.lab.delete.confirm"))) void removeDataset(w, chosen).then((okd) => { if (okd) onRemoved(chosen); }); }}><W k="rs.delete" /></Button>
              </div>
              <p className="text-t1 text-ink-soft">
                {chosen.files[0] ? `${chosen.files[0].name} · ${kb(chosen.files[0].size)} · ` : ""}{String(chosen.provenance.kind ?? "")}{chosen.provenance.importer && chosen.provenance.importer !== "generic" ? ` · ${String(chosen.provenance.importer)}` : ""}{chosen.provenance.symbol ? ` · ${String(chosen.provenance.symbol)}` : ""}{chosen.licence ? ` · ${chosen.licence}` : ""}
              </p>
              <p className="text-t1 text-ink-soft"><W k="rs.lab.engine.cost" /></p>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" kind="solid" size="sm" onClick={() => { void load(); }}>{loadedName ? both("rs.lab.preview") : both("rs.lab.load")}</Button>
                {loadedName ? <Chip>{loadedName}</Chip> : null}
              </div>
              {preview ? <ResultTable table={{ title: both("rs.lab.preview"), columns: preview.columns, rows: preview.rows.map((r) => r.map((v) => (typeof v === "boolean" ? String(v) : v))) }} /> : null}
            </Surface>
            <Surface material="pane" className="px-4 py-3 grid gap-2">
              <h3 className="text-t2 font-medium"><W k="rs.lab.sanity" /></h3>
              <p className="text-t1 text-ink-soft"><W k="rs.lab.sanity.hint" /></p>
              <div className="flex flex-wrap items-end gap-2">
                <Field id="rs-lab-n" label={<W k="rs.lab.statedN" />} inputMode="numeric" value={statedN} onChange={(e) => setStatedN(e.target.value.replace(/\D/g, ""))} />
                <Button type="button" kind="soft" size="sm" onClick={() => { void runSanity(); }}><W k="rs.lab.sanity.run" /></Button>
              </div>
              {check ? <SanityView s={check} /> : null}
            </Surface>
            <Surface material="pane" className="px-4 py-3 grid gap-2">
              <h3 className="text-t2 font-medium"><W k="rs.lab.dictionary" /></h3>
              <p className="text-t1 text-ink-soft"><W k="rs.lab.dictionary.hint" /></p>
              {!chosen.dictionary.length ? <p className="text-t1 text-ink-soft"><W k="rs.lab.needs.load" /></p> : (
                <div className="overflow-x-auto">
                  <table className="text-t1" data-testid="rs-lab-dictionary">
                    <thead><tr><th className="text-left font-normal text-ink-soft pr-2"><W k="rs.lab.column" /></th><th className="text-left font-normal text-ink-soft pr-2"><W k="rs.lab.type" /></th><th className="text-left font-normal text-ink-soft pr-2"><W k="rs.lab.unit" /></th><th className="text-left font-normal text-ink-soft pr-2"><W k="rs.lab.definition" /></th><th className="text-left font-normal text-ink-soft"><W k="rs.lab.variable" /></th></tr></thead>
                    <tbody>
                      {chosen.dictionary.map((c, i) => (
                        <tr key={c.name} className="align-top">
                          <th className="text-left font-normal pr-2 whitespace-nowrap"><code>{c.name}</code></th>
                          <td className="pr-2"><Select id={`rs-dc-type-${i}`} hideLabel label={c.name} value={column(c).type} onChange={(e) => { draft(c, { type: e.target.value as ColumnType }); }} onBlur={() => { void keepColumn(c); }}>{COLUMN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select></td>
                          <td className="pr-2"><Field id={`rs-dc-unit-${i}`} hideLabel label={c.name} value={column(c).unit ?? ""} onChange={(e) => draft(c, { unit: e.target.value })} onBlur={() => { void keepColumn(c); }} autoComplete="off" /></td>
                          <td className="pr-2" style={{ minWidth: "14rem" }}><Field id={`rs-dc-def-${i}`} hideLabel label={c.name} value={column(c).definition ?? ""} onChange={(e) => draft(c, { definition: e.target.value })} onBlur={() => { void keepColumn(c); }} autoComplete="off" /></td>
                          <td>
                            <Select id={`rs-dc-var-${i}`} hideLabel label={c.name} value={column(c).variable_id ?? ""} onChange={(e) => { draft(c, { variable_id: e.target.value || null }); }} onBlur={() => { void keepColumn(c); }}>
                              <option value="">{both("rs.lab.novariable")}</option>
                              {variables.map((v) => <option key={v.id} value={v.id}>{v.text}</option>)}
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Surface>
            {chosen.notes ? <p className="text-t1 whitespace-pre-wrap">{chosen.notes}</p> : null}
            <p className="text-t1 text-ink-soft">{lang === "bn" ? "সোর্স আইডি" : "Source"}: {chosen.source_id ? <a href={`/tools/research/library/${chosen.source_id}`}>{chosen.source_id.slice(0, 8)}</a> : "–"}</p>
          </>
        )}
      </div>
    </div>
  );
}

function SanityView({ s }: { s: Sanity }) {
  return (
    <div className="grid gap-1 text-t1" data-testid="rs-lab-sanity">
      <p>{s.rows} <W k="rs.lab.rows" /> × {s.columns} <W k="rs.lab.columns" />{s.statedN !== null ? <> · {s.nMatches ? <Chip tone="accent">{both("rs.lab.nmatch")}</Chip> : <Chip tone="warn">{both("rs.lab.nmismatch")} {s.statedN}</Chip>}</> : null}</p>
      <p><W k="rs.lab.missing" />: {s.missing.length ? s.missing.map((m) => `${m.name} ${m.count} (${(m.share * 100).toFixed(1)}%)`).join(", ") : "0"}</p>
      <p><W k="rs.lab.outliers" />: {s.outliers.length ? s.outliers.map((o) => `${o.name} max ${fmt(o.max, 2)} vs median ${fmt(o.median, 2)}`).join(", ") : "0"}</p>
      <p><W k="rs.lab.coverage" />: {s.coverage.from ? `${s.coverage.from} to ${s.coverage.to}` : "–"}{s.coverage.countries.length ? ` · ${s.coverage.countries.slice(0, 12).join(", ")}${s.coverage.countries.length > 12 ? "…" : ""}` : ""}</p>
    </div>
  );
}

export function ResultTable({ table, max = 200 }: { table: OutTable; max?: number }) {
  return (
    <div className="overflow-x-auto grid gap-1">
      {table.title ? <p className="text-t1 text-ink-soft">{table.title}{table.rows.length > max ? ` (${max} of ${table.rows.length})` : ""}</p> : null}
      <table className="text-t1 tabular-nums">
        <thead><tr>{table.columns.map((c, i) => <th key={`${c}-${i}`} className="text-left font-normal text-ink-soft pr-3 whitespace-nowrap">{c}</th>)}</tr></thead>
        <tbody>{table.rows.slice(0, max).map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="pr-3 whitespace-nowrap">{fmt(v)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

/* ---------- SQL: a query, a transform, a run ---------- */

function Sql({ w, dataset, ensureLoaded, keepRun, setSaid }: {
  w: Who; dataset: Dataset; ensureLoaded: (d: Dataset) => Promise<string>; keepRun: (part: Partial<Run> & { kind: Run["kind"]; label: string }) => Promise<Run | null>; setSaid: (s: string) => void;
}) {
  const [sql, setSql] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [transforms, setTransforms] = useState<Transform[]>([]);
  useEffect(() => { void listTransforms(w, dataset.id).then(setTransforms); }, [w, dataset.id]);
  useEffect(() => { setSql((s) => s || `SELECT * FROM ${ident(tableOf(dataset))} LIMIT 100`); }, [dataset]);

  const run = async (text = sql): Promise<Answer | null> => {
    setError("");
    try {
      await ensureLoaded(dataset);
      const a = await query(text);
      setAnswer(a);
      return a;
    } catch (e) { setError(String((e as Error).message ?? e)); return null; }
  };
  const keepTransform = async (): Promise<void> => {
    if (!name.trim() || !sql.trim()) return;
    const t = await addTransform(w, dataset.id, name.trim(), sql, transforms.length);
    if (t) { setTransforms((was) => [...was, t]); setName(""); cue("saved"); }
  };
  const view = async (t: Transform): Promise<void> => {
    const a = await run(`CREATE OR REPLACE VIEW ${ident(slug(t.name))} AS ${t.sql}`);
    if (a) { setSaid(`${both("rs.lab.view.made")}: ${slug(t.name)}`); void run(`SELECT * FROM ${ident(slug(t.name))} LIMIT 100`); }
  };
  const asRun = async (): Promise<void> => {
    if (!answer) return;
    await keepRun({ kind: "sql", label: sql.slice(0, 80), code: sql, input: { table: tableOf(dataset) }, output: { columns: answer.columns, rows: answer.rows.slice(0, 500), total: answer.rows.length }, ms: answer.ms });
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.lab.sql.hint" /> <code>{tableOf(dataset)}</code></p>
      <TextArea id="rs-lab-sql" label={<W k="rs.lab.sql" />} value={sql} onChange={(e) => setSql(e.target.value)} rows={6} spellCheck={false} className="font-mono" />
      <div className="flex flex-wrap items-end gap-2">
        <Button type="button" kind="solid" size="sm" onClick={() => { void run(); }}><W k="rs.lab.run" /></Button>
        <Button type="button" kind="soft" size="sm" disabled={!answer} onClick={() => { void asRun(); }}><W k="rs.lab.save.run" /></Button>
        <Field id="rs-lab-tname" label={<W k="rs.lab.transform.name" />} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        <Button type="button" kind="soft" size="sm" disabled={!name.trim()} onClick={() => { void keepTransform(); }}><W k="rs.lab.save.transform" /></Button>
      </div>
      {error ? <p className="text-t1 text-danger" role="alert">{error}</p> : null}
      {answer ? <ResultTable table={{ title: `${answer.rows.length} · ${answer.ms} ms`, columns: answer.columns, rows: answer.rows.map((r) => r.map((v) => (typeof v === "boolean" ? String(v) : v))) }} /> : null}
      {transforms.length ? (
        <div className="grid gap-1">
          <h3 className="text-t2 font-medium"><W k="rs.lab.transforms" /></h3>
          <p className="text-t1 text-ink-soft"><W k="rs.lab.transforms.hint" /></p>
          <ul className="rs-rows grid gap-1" data-testid="rs-lab-transforms">
            {transforms.map((t) => (
              <li key={t.id} className="rs-row">
                <span className="rs-row-main"><span className="rs-row-title">{t.name}</span><span className="rs-row-sub font-mono">{t.sql.slice(0, 120)}</span></span>
                <span className="rs-row-meta flex gap-1">
                  <Button type="button" kind="ghost" size="sm" onClick={() => { void view(t); }}><W k="rs.lab.run" /></Button>
                  <Button type="button" kind="quiet" size="sm" onClick={() => { void removeTransform(w, t).then((okd) => { if (okd) setTransforms((was) => was.filter((x) => x.id !== t.id)); }); }}><W k="rs.delete" /></Button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Surface>
  );
}

/* ---------- statistics: one form for every method ---------- */

function Stats({ lang, dataset, ensureLoaded, keepRun, setSaid }: {
  lang: "en" | "bn"; dataset: Dataset; ensureLoaded: (d: Dataset) => Promise<string>; keepRun: (part: Partial<Run> & { kind: Run["kind"]; label: string }) => Promise<Run | null>; setSaid: (s: string) => void;
}) {
  const [methodId, setMethodId] = useState(() => { const m = new URLSearchParams(location.search).get("method"); return METHODS.some((x) => x.id === m) ? String(m) : "describe"; });
  const method = METHODS.find((m) => m.id === methodId) ?? METHODS[0];
  const [picks, setPicks] = useState<Record<string, string[]>>({});
  const [options, setOptions] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [stars, setStars] = useState(true);
  const [label, setLabel] = useState("");
  const numeric = dataset.dictionary.filter((c) => c.type === "number").map((c) => c.name);
  const all = dataset.dictionary.map((c) => c.name);
  useEffect(() => { setPicks({}); setResult(null); setOptions(Object.fromEntries(method.options.map((o) => [o.key, o.value]))); }, [method]);

  const toggle = (role: Role, name: string): void => setPicks((was) => {
    const cur = was[role.key] ?? [];
    if (!role.many) return { ...was, [role.key]: name ? [name] : [] };
    return { ...was, [role.key]: cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name] };
  });
  const ready = method.roles.every((r) => r.optional || (picks[r.key]?.length ?? 0) > 0);

  const run = async (): Promise<void> => {
    setError("");
    try {
      const name = await ensureLoaded(dataset);
      const { result: res } = await runStored(name, { method: method.id, roles: picks, options });
      const cols = [...new Set(method.roles.flatMap((r) => picks[r.key] ?? []))];
      setResult(res);
      setLabel(`${lang === "bn" ? method.bn : method.en}: ${cols.join(", ")}`.slice(0, 80));
    } catch (e) { setError(String((e as Error).message ?? e)); setResult(null); }
  };
  const keep = async (): Promise<void> => {
    if (!result) return;
    await keepRun(statRun(result, { method: method.id, roles: picks, options, stars }, label || method.id, tableOf(dataset)));
  };
  const apa = result?.fit ? apaTable(result.fit, { stars, depvar: depvarOf(picks) }) : null;
  const groups = [...new Set(METHODS.map((m) => m.group))];

  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.lab.method.hint" /></p>
      <Select id="rs-lab-method" label={<W k="rs.lab.method" />} value={methodId} onChange={(e) => setMethodId(e.target.value)}>
        {groups.map((g) => <optgroup key={g} label={both(`rs.lab.group.${g}`)}>{METHODS.filter((m) => m.group === g).map((m) => <option key={m.id} value={m.id}>{lang === "bn" ? m.bn : m.en}</option>)}</optgroup>)}
      </Select>
      {!numeric.length ? <p className="text-t1 text-ink-soft"><W k="rs.lab.needs.load" /></p> : null}
      <div className="grid gap-2 md:grid-cols-2">
        {method.roles.map((role) => (
          <div key={role.key} className="grid gap-1">
            <span className="text-t1 text-ink-soft"><T en={role.en} bn={role.bn} />{role.optional ? "" : " *"}</span>
            {role.many ? (
              <div className="flex flex-wrap gap-1" data-testid={`rs-role-${role.key}`}>
                {(role.kind === "number" ? numeric : all).map((c) => <ChipButton key={c} pressed={(picks[role.key] ?? []).includes(c)} onClick={() => toggle(role, c)}>{c}</ChipButton>)}
              </div>
            ) : (
              <Select id={`rs-role-${role.key}`} hideLabel label={role.en} value={picks[role.key]?.[0] ?? ""} onChange={(e) => toggle(role, e.target.value)}>
                <option value=""></option>
                {(role.kind === "number" ? numeric : all).map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            )}
          </div>
        ))}
      </div>
      {method.options.length ? (
        <div className="grid gap-2 md:grid-cols-3">
          {method.options.map((o) => o.choices ? (
            <Select key={o.key} id={`rs-opt-${o.key}`} label={<T en={o.en} bn={o.bn} />} value={options[o.key] ?? o.value} onChange={(e) => setOptions((was) => ({ ...was, [o.key]: e.target.value }))}>
              {o.choices.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          ) : (
            <Field key={o.key} id={`rs-opt-${o.key}`} label={<T en={o.en} bn={o.bn} />} value={options[o.key] ?? o.value} onChange={(e) => setOptions((was) => ({ ...was, [o.key]: e.target.value }))} autoComplete="off" />
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" kind="solid" size="sm" disabled={!ready} onClick={() => { void run(); }}><W k="rs.lab.run" /></Button>
        {result ? <Button type="button" kind="soft" size="sm" onClick={() => { void keep(); }}><W k="rs.lab.save.run" /></Button> : null}
        {result?.fit ? <label className="flex items-center gap-2 text-t1"><input type="checkbox" checked={stars} onChange={(e) => setStars(e.target.checked)} /> <W k="rs.lab.stars" /></label> : null}
      </div>
      {error ? <p className="text-t1 text-danger" role="alert">{error}</p> : null}
      {result ? (
        <div className="grid gap-3" data-testid="rs-lab-result">
          <p className="text-t1"><Chip tone="accent">{result.summary}</Chip></p>
          {result.tables.map((t, i) => <ResultTable key={i} table={t} />)}
          {apa ? (
            <details className="grid gap-1">
              <summary className="cursor-pointer text-t1"><W k="rs.lab.apa" /></summary>
              <pre className="text-t1 whitespace-pre-wrap" data-testid="rs-lab-apa">{apa.markdown}</pre>
              <Button type="button" kind="ghost" size="sm" onClick={() => { void navigator.clipboard?.writeText(apa.markdown); setSaid(both("rs.copied")); }}><W k="rs.lab.apa.copy" /></Button>
            </details>
          ) : null}
          {result.chart ? <img src={svgUrl(chartSvg(result.chart))} alt={result.summary} className="max-w-full h-auto" /> : null}
          <Field id="rs-lab-label" label={<W k="rs.lab.label" />} value={label} onChange={(e) => setLabel(e.target.value)} autoComplete="off" />
        </div>
      ) : null}
    </Surface>
  );
}

/** A result as the row a statistics run is kept as: the fit
    without its residuals, the APA text, the figure as SVG. */
export function statRun(result: Result, input: StatInput, label: string, table: string): Partial<Run> & { kind: Run["kind"]; label: string } {
  const fit = result.fit ? { ...result.fit, residuals: undefined, fitted: undefined } : undefined;
  const apa = result.fit ? apaTable(result.fit, { stars: input.stars, depvar: depvarOf(input.roles) }) : null;
  const method = METHODS.find((m) => m.id === input.method);
  const cols = [...new Set((method?.roles ?? []).flatMap((r) => input.roles[r.key] ?? []))];
  return {
    kind: "stat", label, input: { ...input },
    code: `SELECT ${cols.map(ident).join(", ")} FROM ${ident(table)}`,
    output: { summary: result.summary, tables: result.tables, fit, apa: apa?.markdown ?? null, notes: apa?.notes ?? null },
    figure: result.chart ? chartSvg({ ...result.chart, title: label }) : null,
  };
}

/* ---------- charts ---------- */

function Charts({ dataset, ensureLoaded, keepRun, setSaid }: {
  dataset: Dataset; ensureLoaded: (d: Dataset) => Promise<string>; keepRun: (part: Partial<Run> & { kind: Run["kind"]; label: string }) => Promise<Run | null>; setSaid: (s: string) => void;
}) {
  const [kind, setKind] = useState<ChartOptions["kind"]>("line");
  const [x, setX] = useState("");
  const [ys, setYs] = useState<string[]>([]);
  const [svg, setSvg] = useState("");
  const [title, setTitle] = useState("");
  const numeric = dataset.dictionary.filter((c) => c.type === "number").map((c) => c.name);
  const xs = dataset.dictionary.filter((c) => c.type === "number" || c.type === "date").map((c) => c.name);
  const draw = async (): Promise<void> => {
    try {
      const name = await ensureLoaded(dataset);
      const cols = [...(x ? [x] : []), ...ys];
      const a = await query(`SELECT ${cols.map(ident).join(", ")} FROM ${ident(name)}${x ? ` ORDER BY ${ident(x)}` : ""}`);
      const xi = x ? a.columns.indexOf(x) : -1;
      const dates = x ? dataset.dictionary.find((c) => c.name === x)?.type === "date" : false;
      const series: Series[] = ys.map((yName) => {
        const yi = a.columns.indexOf(yName);
        const points: { x: number; y: number }[] = [];
        a.rows.forEach((r, i) => {
          const yv = r[yi];
          if (typeof yv !== "number") return;
          const xv = xi >= 0 ? (dates ? dayOf(String(r[xi])) : typeof r[xi] === "number" ? (r[xi] as number) : null) : i;
          if (xv === null) return;
          points.push({ x: xv, y: yv });
        });
        return { name: yName, points };
      });
      const s = chartSvg(kind === "hist" ? { kind, series: [histogram(series[0]?.points.map((p) => p.y) ?? [])], xLabel: ys[0], yLabel: "count", title } : { kind, series, xLabel: x || undefined, xDates: dates, title });
      setSvg(s);
    } catch (e) { setSaid(`${both("rs.lab.engine.failed")}: ${String((e as Error).message ?? e)}`); }
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.lab.charts.hint" /></p>
      <div className="grid gap-2 md:grid-cols-3">
        <Select id="rs-chart-kind" label={<W k="rs.lab.chart.kind" />} value={kind} onChange={(e) => setKind(e.target.value as ChartOptions["kind"])}>
          {(["line", "scatter", "bar", "hist"] as const).map((k) => <option key={k} value={k}>{k}</option>)}
        </Select>
        <Select id="rs-chart-x" label={<W k="rs.lab.chart.x" />} value={x} onChange={(e) => setX(e.target.value)}><option value=""></option>{xs.map((c) => <option key={c} value={c}>{c}</option>)}</Select>
        <Field id="rs-chart-title" label={<W k="rs.lab.label" />} value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
      </div>
      <div className="grid gap-1">
        <span className="text-t1 text-ink-soft"><W k="rs.lab.chart.y" /></span>
        <div className="flex flex-wrap gap-1">{numeric.map((c) => <ChipButton key={c} pressed={ys.includes(c)} onClick={() => setYs((was) => (was.includes(c) ? was.filter((v) => v !== c) : [...was, c]))}>{c}</ChipButton>)}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" kind="solid" size="sm" disabled={!ys.length} onClick={() => { void draw(); }}><W k="rs.lab.draw" /></Button>
        {svg ? <Button type="button" kind="soft" size="sm" onClick={() => { void keepRun({ kind: "chart", label: title || `${kind}: ${ys.join(", ")}`, input: { kind, x, ys, title }, code: "", output: { kind, x, ys }, figure: svg }); }}><W k="rs.lab.save.run" /></Button> : null}
        {svg ? <Button type="button" kind="ghost" size="sm" onClick={() => download(`${slug(title || ys.join("-"))}.svg`, svg, "image/svg+xml")}><W k="rs.rev.svg" /></Button> : null}
      </div>
      {svg ? <img src={svgUrl(svg)} alt={title} className="max-w-full h-auto" data-testid="rs-lab-chart" /> : null}
    </Surface>
  );
}

/* ---------- runs ---------- */

const KIND_TONES: Record<string, string> = { sql: "teal", stat: "blue", chart: "gold", python: "violet", check: "rose" };

function Runs({ w, lang, runs, datasets, onRemoved, setSaid }: { w: Who; lang: "en" | "bn"; runs: Run[]; datasets: Dataset[]; onRemoved: (r: Run) => void; setSaid: (s: string) => void }) {
  const [ticked, setTicked] = useState<string[]>([]);
  const models = ticked.map((id) => runs.find((r) => r.id === id)).filter((r): r is Run => Boolean(r)).map(modelOf).filter((m): m is NonNullable<typeof m> => m !== null);
  const cmp = models.length >= 2 ? compareRuns(models) : null;
  const copy = (text: string): void => { void navigator.clipboard?.writeText(text); setSaid(both("rs.copied")); };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-2">
      <p className="text-t1 text-ink-soft"><W k="rs.lab.runs.hint" /> <W k="rs.lab.compare.hint" /></p>
      {ticked.length >= 2 ? (
        <div className="grid gap-2" data-testid="rs-lab-compare">
          <h3 className="text-t2 font-medium"><W k="rs.lab.compare" /></h3>
          {!cmp ? <p className="text-t1 text-ink-soft"><W k="rs.lab.compare.none" /></p> : (
            <>
              <div className="overflow-x-auto">
                <table className="text-t1 tabular-nums">
                  <thead><tr>{cmp.rows[0].map((c, i) => <th key={i} className="text-left font-normal text-ink-soft pr-3 whitespace-nowrap">{c}</th>)}</tr></thead>
                  <tbody>{cmp.rows.slice(1).map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="pr-3 whitespace-nowrap">{v}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <p className="text-t1 text-ink-soft">{cmp.notes}</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" kind="ghost" size="sm" onClick={() => copy(cmp.markdown)}><W k="rs.lab.compare.md" /></Button>
                <Button type="button" kind="ghost" size="sm" onClick={() => copy(cmp.latex)}><W k="rs.lab.compare.tex" /></Button>
              </div>
            </>
          )}
        </div>
      ) : null}
      {!runs.length ? <p className="text-t2 text-ink-soft"><W k="rs.none" /></p> : (
        <ul className="rs-rows grid gap-1" data-testid="rs-lab-runs">
          {runs.map((r) => (
            <li key={r.id} className="rs-row">
              {modelOf(r) ? <input type="checkbox" className="mr-1" aria-label={`${both("rs.lab.compare")}: ${r.label || r.kind}`} checked={ticked.includes(r.id)} onChange={(e) => setTicked((was) => (e.target.checked ? [...was, r.id] : was.filter((x) => x !== r.id)))} /> : null}
              <span className="rs-row-dot" aria-hidden="true" style={{ "--tone": toneVar(KIND_TONES[r.kind] as "teal") } as CSSProperties} />
              <span className="rs-row-main">
                <a className="rs-row-title" href={`/tools/research/lab/run/${r.id}`}>{r.label || r.kind}</a>
                <span className="rs-row-sub">{r.kind} · {new Date(r.created_at).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB")}{r.dataset_id ? ` · ${datasets.find((d) => d.id === r.dataset_id)?.name ?? ""}` : ""}{typeof r.output.summary === "string" ? ` · ${r.output.summary}` : ""}</span>
              </span>
              <span className="rs-row-meta"><Button type="button" kind="quiet" size="sm" onClick={() => { void removeRun(w, r).then((okd) => { if (okd) onRemoved(r); }); }}><W k="rs.delete" /></Button></span>
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}

/* ---------- market data, through the Worker ---------- */

function Market({ w, onMade, setSaid }: { w: Who; onMade: (d: Dataset) => void; setSaid: (s: string) => void }) {
  const [symbol, setSymbol] = useState("");
  const [full, setFull] = useState(false);
  const [series, setSeries] = useState<Awaited<ReturnType<typeof marketSeries>>>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fetchIt = async (): Promise<void> => {
    setBusy(true); setError("");
    try {
      const s = await marketSeries(w, symbol.trim(), full);
      if (!s) { setError(both("rs.lab.market.off")); setSeries(null); return; }
      setSeries(s);
    } finally { setBusy(false); }
  };
  const save = async (): Promise<void> => {
    if (!series) return;
    const csv = ["date,open,high,low,close,volume", ...series.bars.map((b) => `${b.date},${b.open},${b.high},${b.low},${b.close},${b.volume}`)].join("\n") + "\n";
    const file = new File([csv], `${series.symbol.toLowerCase()}-daily.csv`, { type: "text/csv" });
    const made = await importFile(w, file, { name: `${series.symbol} daily`, provenance: { kind: "market", symbol: series.symbol, source: series.source, fetched: series.fetched } });
    if ("error" in made) { setError(`${both("rs.lab.failed")}: ${made.error}`); return; }
    onMade(made); cue("saved"); setSaid(both("rs.saved"));
  };
  const svg = series ? chartSvg({ kind: "line", series: [{ name: "close", points: series.bars.map((b) => ({ x: dayOf(b.date) ?? 0, y: b.close })) }], xDates: true, yLabel: "close", title: series.symbol }) : "";
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.lab.market.hint" /></p>
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void fetchIt(); }}>
        <Field id="rs-lab-symbol" label={<W k="rs.lab.symbol" />} value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} autoComplete="off" />
        <label className="flex items-center gap-2 text-t1"><input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} /> <W k="rs.lab.market.full" /></label>
        <Button type="submit" kind="solid" size="sm" disabled={!symbol.trim() || busy}><W k="rs.lab.fetch" /></Button>
      </form>
      {error ? <p className="text-t1 text-danger" role="alert">{error}</p> : null}
      {series ? (
        <div className="grid gap-2" data-testid="rs-lab-series">
          <p className="text-t1"><Chip tone="accent">{series.symbol}</Chip> {series.bars.length} {both("rs.lab.bars")} · {series.bars[0]?.date} → {series.bars[series.bars.length - 1]?.date} · {series.source}</p>
          <img src={svgUrl(svg)} alt={series.symbol} className="max-w-full h-auto" />
          <div><Button type="button" kind="soft" size="sm" onClick={() => { void save(); }}><W k="rs.lab.market.save" /></Button></div>
        </div>
      ) : null}
    </Surface>
  );
}

/* ---------- climate for a place, through the Worker ---------- */

/** A coordinate as the Worker will round it, or null. */
const coordOf = (raw: string, limit: number): number | null => {
  const n = Number(raw);
  return raw.trim() !== "" && Number.isFinite(n) && Math.abs(n) <= limit ? Math.round(n * 100) / 100 : null;
};

function Climate({ w, onMade, setSaid }: { w: Who; onMade: (d: Dataset) => void; setSaid: (s: string) => void }) {
  const year = new Date().getFullYear();
  const [place, setPlace] = useState("");
  const [found, setFound] = useState<PlaceFound[]>([]);
  const [chosen, setChosen] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [from, setFrom] = useState(`${year - 1}-01-01`);
  const [to, setTo] = useState(`${year - 1}-12-31`);
  const [series, setSeries] = useState<ClimateSeries | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const q = place.trim();
    if (q.length < 2) { setFound([]); return; }
    let alive = true;
    const timer = setTimeout(() => { void findPlaces(q).then((p) => { if (alive) setFound(p); }); }, 280);
    return () => { alive = false; clearTimeout(timer); };
  }, [place]);
  const la = coordOf(lat, 90), lo = coordOf(lon, 180);
  const ready = la !== null && lo !== null && /^\d{4}-\d{2}-\d{2}$/.test(from) && /^\d{4}-\d{2}-\d{2}$/.test(to) && from <= to;
  const fetchIt = async (): Promise<void> => {
    if (la === null || lo === null) return;
    setBusy(true); setError("");
    try {
      const s = await climateSeries(w, { lat: la, lon: lo, from, to });
      if (!s) { setError(both("rs.lab.climate.off")); setSeries(null); return; }
      setSeries(s);
    } finally { setBusy(false); }
  };
  const save = async (): Promise<void> => {
    if (!series) return;
    const csv = [series.columns.join(","), ...series.rows.map((r) => r.map((v) => (v === null ? "" : String(v))).join(","))].join("\n") + "\n";
    const where = chosen || `${series.lat}, ${series.lon}`;
    const file = new File([csv], `climate-${series.lat}-${series.lon}-${series.from}-${series.to}.csv`.replace(/[^a-z0-9.-]+/gi, "-"), { type: "text/csv" });
    const made = await importFile(w, file, {
      name: `${both("rs.lab.climate")}: ${where} ${series.from.slice(0, 4)}${series.to.slice(0, 4) !== series.from.slice(0, 4) ? `–${series.to.slice(0, 4)}` : ""}`,
      licence: series.licence,
      provenance: { kind: "climate", source: series.source, licence: series.licence, lat: series.lat, lon: series.lon, from: series.from, to: series.to, place: chosen || null, units: series.units, fetched: series.fetched },
    });
    if ("error" in made) { setError(`${both("rs.lab.failed")}: ${made.error}`); return; }
    onMade(made); cue("saved"); setSaid(both("rs.saved"));
  };
  const svg = series ? chartSvg({
    kind: "line", xDates: true, yLabel: "°C", title: chosen || `${series.lat}, ${series.lon}`,
    series: [
      { name: "tmax", points: series.rows.flatMap((r) => (typeof r[1] === "number" ? [{ x: dayOf(String(r[0])) ?? 0, y: r[1] }] : [])) },
      { name: "tmin", points: series.rows.flatMap((r) => (typeof r[2] === "number" ? [{ x: dayOf(String(r[0])) ?? 0, y: r[2] }] : [])) },
    ],
  }) : "";
  const rain = series ? series.rows.reduce((a, r) => a + (typeof r[4] === "number" ? r[4] : 0), 0) : 0;
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.lab.climate.hint" /></p>
      <div className="grid gap-1">
        <Field id="rs-lab-place" label={<W k="rs.lab.place" />} value={place} onChange={(e) => setPlace(e.target.value)} autoComplete="off" />
        <p className="text-t1 text-ink-soft"><W k="rs.lab.place.hint" /></p>
        {found.length ? (
          <div className="flex flex-wrap gap-1" data-testid="rs-lab-places">
            {found.map((p) => <ChipButton key={p.id} pressed={chosen === (p.where ? `${p.name}, ${p.where}` : p.name)} onClick={() => { setLat(String(p.lat)); setLon(String(p.lon)); setChosen(p.where ? `${p.name}, ${p.where}` : p.name); setFound([]); setPlace(""); }}>{p.name}{p.where ? `, ${p.where}` : ""}</ChipButton>)}
          </div>
        ) : null}
      </div>
      <form className="grid gap-2 md:grid-cols-4" onSubmit={(e) => { e.preventDefault(); void fetchIt(); }}>
        <Field id="rs-lab-lat" label={<W k="rs.lab.lat" />} inputMode="decimal" value={lat} onChange={(e) => { setLat(e.target.value); setChosen(""); }} autoComplete="off" />
        <Field id="rs-lab-lon" label={<W k="rs.lab.lon" />} inputMode="decimal" value={lon} onChange={(e) => { setLon(e.target.value); setChosen(""); }} autoComplete="off" />
        <Field id="rs-lab-from" label={<W k="rs.lab.from" />} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Field id="rs-lab-to" label={<W k="rs.lab.to" />} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <div className="md:col-span-4 flex flex-wrap items-center gap-2">
          {chosen ? <Chip tone="accent">{chosen}</Chip> : null}
          <Button type="submit" kind="solid" size="sm" disabled={!ready || busy}><W k="rs.lab.fetch" /></Button>
        </div>
      </form>
      {error ? <p className="text-t1 text-danger" role="alert">{error}</p> : null}
      {series ? (
        <div className="grid gap-2" data-testid="rs-lab-climate">
          <p className="text-t1"><Chip tone="accent">{series.lat}, {series.lon}</Chip> {series.rows.length} {both("rs.lab.days")} · {series.from} → {series.to} · {fmt(rain, 1)} mm · {series.source}, {series.licence}</p>
          <img src={svgUrl(svg)} alt={`${series.lat}, ${series.lon}`} className="max-w-full h-auto" />
          <ResultTable table={{ title: both("rs.lab.preview"), columns: series.columns, rows: series.rows.slice(0, 10) }} max={10} />
          <div><Button type="button" kind="soft" size="sm" onClick={() => { void save(); }}><W k="rs.lab.climate.save" /></Button></div>
        </div>
      ) : null}
    </Surface>
  );
}
