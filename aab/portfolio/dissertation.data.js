/* ============================================================
   dissertation.data.js: the numbers behind the case study.

   ------------------------------------------------------------
   WHERE THESE COME FROM

   This is a real MSc dissertation, submitted at the University
   of Brighton: "Are Islamic mutual funds exposed to lower risk
   than conventional funds? Evidence from the United Kingdom."
   Sample: UK-domiciled equity funds, monthly NAV-based returns,
   January 2018 to July 2025.

   Every table on this page is transcribed from the submitted
   document. Every series is lifted out of the charts embedded in
   it, Word stores a chart's data alongside the picture, so the
   FTSE 100 series, the Islamic index series, the two group
   drawdown curves, the 216 fund-level standard deviations and
   the full 19,797-observation excess-return column are the
   actual numbers that produced the actual figures, not a
   redrawing by eye.

   Nothing here is invented, smoothed or extended. Where the
   underlying data cannot be published, Bloomberg's terms cover
   the fund-level NAV panel, the page shows the derived
   statistics and says so rather than fabricating a stand-in.

   PROVENANCE TAGS used below:
     "doc"    transcribed from a table in the dissertation
     "chart"  extracted from a chart's embedded data cache
     "derived" computed on this page from one of the above
   ============================================================ */

export const STUDY = {
  title: "Are Islamic mutual funds exposed to lower risk than conventional funds?",
  subtitle: "Evidence from the United Kingdom, 2018–2025",
  degree: "MSc Finance and Risk Management dissertation",
  institution: "University of Brighton",
  words: "≈15,000",
  supervisor: "Dafni Papoutsaki",
  sampleStart: "2018-01",
  sampleEnd: "2025-07",
};

/* ------------------------------------------------------------
   Sample composition, doc, Methodology §Data Sources
   ------------------------------------------------------------ */
export const SAMPLE = {
  months: 91,
  funds: { islamic: 3, conventional: 217, total: 220 },
  observations: { islamic: 264, conventional: 19313, total: 19577 },
  /* The excess-return column carries a few more rows than the
     regressions do: an observation without a matching factor
     month drops out of the fit. */
  excessRows: 19797,
  sources: [
    ["Fund NAVs", "Bloomberg Terminal", "UK-domiciled equity funds only, monthly last price, Jan 2018 → Jul 2025"],
    ["Fund classification", "Bloomberg / MIGB index membership", "Islamic dummy = 1 for Shariah-compliant funds, 0 otherwise"],
    ["Risk-free rate", "Bank of England", "UK 3-month Treasury bill yield, converted to a monthly rate"],
    ["Risk factors", "Kenneth R. French Data Library", "MktRF, SMB, HML, RMW, CMA (Fama–French five-factor) and MOM (Carhart)"],
  ],
};

/* ------------------------------------------------------------
   Table 1, univariate comparison. doc, Analysis §Descriptive
   Two-sample t-tests, unequal variances, equally weighted across
   funds. Every p-value is far above 0.05.
   ------------------------------------------------------------ */
export const UNIVARIATE = [
  {
    key: "sharpe", label: "Sharpe ratio", islamic: -2.0948, conventional: -2.9586,
    p: 0.2118, dp: 4, better: "higher",
    note: "Mean excess return per unit of total volatility (Sharpe, 1966).",
  },
  {
    key: "sd", label: "Return volatility (monthly σ)", islamic: 0.0356, conventional: 0.0367,
    p: 0.8536, dp: 4, better: "lower",
    note: "Standard deviation of monthly fund returns, total risk.",
  },
  {
    key: "beta", label: "CAPM beta", islamic: 0.9148, conventional: 0.9149,
    p: 0.9923, dp: 4, better: "lower",
    note: "Systematic risk: slope on the market excess return.",
  },
  {
    key: "treynor", label: "Treynor ratio", islamic: -0.0758, conventional: -0.0809,
    p: 0.3402, dp: 4, better: "higher",
    note: "Excess return per unit of systematic risk (Treynor, 1965).",
  },
  {
    key: "alpha", label: "Jensen's alpha (monthly)", islamic: -0.0010, conventional: -0.0050,
    p: 0.3955, dp: 4, better: "higher",
    note: "CAPM intercept: abnormal return after market risk (Jensen, 1968).",
  },
];

/* ------------------------------------------------------------
   Multi-factor regressions, doc, Analysis §Multi-factor results
   Dependent variable: monthly fund excess return.
   OLS, Excel Data Analysis ToolPak, no clustering (see the
   limitations section: this matters).
   ------------------------------------------------------------ */
const COEF = (name, label, b, se, t, p, lo, hi) =>
  ({ name, label, b, se, t, p, lo, hi });

export const REGRESSIONS = {
  pooled: {
    key: "pooled",
    label: "Pooled + Islamic dummy",
    blurb:
      "Every fund-month in one regression, with a dummy that switches on for " +
      "Islamic funds. The dummy is the whole research question in one coefficient.",
    n: 19577, r2: 0.6992, adjR2: 0.6990, rmse: 0.04526, f: 6496.80, fp: 0,
    dfNum: 7, dfDen: 19569,
    coefs: [
      COEF("alpha", "Intercept (α)", -0.003790, 0.000509, -7.449, 9.81e-14, -0.004787, -0.002793),
      COEF("mktrf", "MktRF: market", 0.918135, 0.005032, 182.445, 1e-300, 0.908271, 0.927999),
      COEF("smb", "SMB: size", 0.000858, 0.000201, 4.278, 1.89e-5, 0.000465, 0.001252),
      COEF("hml", "HML: value", -0.004285, 0.000215, -19.895, 3.29e-87, -0.004707, -0.003863),
      COEF("rmw", "RMW: profitability", -0.002606, 0.000333, -7.823, 5.43e-15, -0.003258, -0.001953),
      COEF("cma", "CMA: investment", -0.002125, 0.000338, -6.292, 3.19e-10, -0.002787, -0.001463),
      COEF("mom", "MOM: momentum", 0.000270, 0.000121, 2.236, 0.0254, 0.000033, 0.000507),
      COEF("islamic", "Islamic dummy", 0.003901, 0.002804, 1.391, 0.164, -0.001596, 0.009397),
    ],
  },
  islamic: {
    key: "islamic",
    label: "Islamic funds only",
    blurb:
      "The same specification on 264 fund-months from three funds. The fit is " +
      "tighter, but three funds is three funds, and the standard errors say so.",
    n: 264, r2: 0.8833, adjR2: 0.8806, rmse: 0.02609, f: 324.14, fp: 8.87e-117,
    dfNum: 6, dfDen: 257,
    coefs: [
      COEF("alpha", "Intercept (α)", -0.000222, 0.002517, -0.088, 0.9298, -0.005178, 0.004734),
      COEF("mktrf", "MktRF: market", 0.917432, 0.024845, 36.926, 9.33e-105, 0.868506, 0.966359),
      COEF("smb", "SMB: size", -0.001251, 0.000994, -1.258, 0.2095, -0.003209, 0.000707),
      COEF("hml", "HML: value", -0.005328, 0.001065, -5.000, 1.06e-6, -0.007426, -0.003230),
      COEF("rmw", "RMW: profitability", -0.002703, 0.001644, -1.644, 0.1014, -0.005941, 0.000535),
      COEF("cma", "CMA: investment", -0.004324, 0.001670, -2.589, 0.0102, -0.007613, -0.001034),
      COEF("mom", "MOM: momentum", 0.000076, 0.000597, 0.127, 0.8992, -0.001100, 0.001251),
    ],
  },
  conventional: {
    key: "conventional",
    label: "Conventional funds only",
    blurb:
      "217 funds, 19,313 fund-months. Effectively identical to the pooled model, " +
      "which is what happens when one group is 99% of the panel.",
    n: 19313, r2: 0.6972, adjR2: 0.6971, rmse: 0.04546, f: 7407.01, fp: 0,
    dfNum: 6, dfDen: 19306,
    coefs: [
      COEF("alpha", "Intercept (α)", -0.003786, 0.000513, -7.378, 1.68e-13, -0.004791, -0.002780),
      COEF("mktrf", "MktRF: market", 0.918144, 0.005089, 180.401, 1e-300, 0.908168, 0.928120),
      COEF("smb", "SMB: size", 0.000888, 0.000203, 4.374, 1.23e-5, 0.000490, 0.001285),
      COEF("hml", "HML: value", -0.004270, 0.000218, -19.606, 9.24e-85, -0.004697, -0.003844),
      COEF("rmw", "RMW: profitability", -0.002604, 0.000337, -7.731, 1.12e-14, -0.003264, -0.001944),
      COEF("cma", "CMA: investment", -0.002095, 0.000342, -6.133, 8.77e-10, -0.002764, -0.001425),
      COEF("mom", "MOM: momentum", 0.000273, 0.000122, 2.233, 0.0256, 0.000033, 0.000513),
    ],
  },
};

export const SPEC_ORDER = ["pooled", "islamic", "conventional"];

/* What each factor is, in one sentence, for the reader who has
   not spent a year with Kenneth French's data library. */
export const FACTORS = [
  { name: "mktrf", short: "MktRF", full: "Market minus risk-free",
    what: "The whole equity market's return above cash. A loading near 1 means the fund moves with the market almost one for one." },
  { name: "smb", short: "SMB", full: "Small minus big",
    what: "Small companies' return minus large companies'. Positive loading = a tilt towards smaller firms." },
  { name: "hml", short: "HML", full: "High minus low book-to-market",
    what: "Value stocks minus growth stocks. Negative loading = a growth tilt, which is what screening out leveraged financials produces." },
  { name: "rmw", short: "RMW", full: "Robust minus weak profitability",
    what: "Highly profitable firms minus weakly profitable ones (Fama & French, 2015)." },
  { name: "cma", short: "CMA", full: "Conservative minus aggressive investment",
    what: "Firms that reinvest little minus firms that reinvest heavily. Negative loading = exposure to the aggressive-investment side." },
  { name: "mom", short: "MOM", full: "Momentum",
    what: "Past winners minus past losers (Carhart, 1997). Islamic screening bars the speculative trading that harvests it." },
  { name: "islamic", short: "Islamic", full: "Fund-type dummy",
    what: "1 for a Shariah-compliant fund, 0 otherwise. This coefficient is the answer to the research question." },
  { name: "alpha", short: "α", full: "Intercept",
    what: "What is left after every factor exposure is paid for: the part a manager could claim as skill." },
];

/* ------------------------------------------------------------
   Table 5, idiosyncratic volatility. doc, Analysis §IVOL
   Fund-level residual standard error from a CAPM regression.
   ------------------------------------------------------------ */
export const IVOL = {
  islamic: { n: 3, mean: 0.031390, median: 0.037953, sd: 0.011940, min: 0.017609, max: 0.038609 },
  conventional: { n: 217, mean: 0.032632, median: 0.028307, sd: 0.034491, min: 0.005964, max: 0.486683 },
  diff: -0.001241,
  p: 0.877487,
};

/* ------------------------------------------------------------
   Drawdown summary, doc, Analysis §Drawdown
   The only comparison in the whole study that lands anywhere
   near a conventional significance threshold.
   ------------------------------------------------------------ */
export const MDD = {
  islamic: -0.1778721,
  conventional: -0.2347682,
  p: 0.06847027,
};

/* ------------------------------------------------------------
   The evidence map: the literature review, made countable.

   Each row is a study the review engages with, tagged by what it
   found for Islamic funds relative to conventional ones. The
   point of the exhibit is that the disagreement in this
   literature is not random: it sorts by market, by period, and
   above all by which risk measure was chosen.
   ------------------------------------------------------------ */
export const EVIDENCE = [
  { study: "Sharpe", year: 1966, market: "US", level: "Funds", focus: "Return",
    finding: "n/a", note: "Establishes the risk-adjusted ratio the whole literature still uses." },
  { study: "Jensen", year: 1968, market: "US", level: "Funds", focus: "Return",
    finding: "n/a", note: "Alpha: mutual funds struggle to beat their risk exposure after costs." },
  { study: "Hayat & Kraeussl", year: 2011, market: "Global (145 funds)", level: "Funds", focus: "Return",
    finding: "worse", note: "Islamic equity funds underperform both Islamic and conventional benchmarks, 2000–2009; worse in the crisis." },
  { study: "Hoepner, Rammal & Rezec", year: 2011, market: "20 countries", level: "Funds", focus: "Style",
    finding: "mixed", note: "Islamic funds are not homogeneous internationally; investment style drives the differences." },
  { study: "Mansor & Bhatti", year: 2011, market: "Malaysia", level: "Funds", focus: "Return",
    finding: "same", note: "No significant return difference; risk characteristics do differ." },
  { study: "Walkshäusl & Lobe", year: 2012, market: "Global", level: "Indices", focus: "Return",
    finding: "same", note: "Screening changes the opportunity set without a reliable performance penalty." },
  { study: "Abdelsalam et al.", year: 2014, market: "Global", level: "Funds", focus: "Return",
    finding: "mixed", note: "Conclusions depend on the performance measure; means hide cross-fund heterogeneity." },
  { study: "Ho et al.", year: 2014, market: "Global", level: "Indices", focus: "Regime",
    finding: "better", note: "Islamic indices outperform during crises; inconclusive outside them." },
  { study: "Nainggolan, How & Verhoeven", year: 2016, market: "Global", level: "Funds", focus: "Return",
    finding: "worse", note: "Screening costs roughly 40bp per month." },
  { study: "Reddy et al.", year: 2017, market: "United Kingdom", level: "Funds", focus: "Risk-adjusted",
    finding: "mixed", note: "The closest UK precedent: Islamic, SRI and conventional differ by category, with no universal winner." },
  { study: "Climent & Soriano", year: 2020, market: "US", level: "Funds", focus: "Return",
    finding: "better", note: "US Islamic funds outperform over long horizons, 1987–2018." },
  { study: "Naveed, Khawaja & Maroof", year: 2020, market: "Pakistan", level: "Funds", focus: "Risk",
    finding: "better", note: "Lower total, systematic, idiosyncratic and downside risk in most sample years." },
  { study: "Mirza et al.", year: 2022, market: "Global", level: "Funds", focus: "Regime",
    finding: "better", note: "Islamic equity funds show resilience through COVID-19." },
  { study: "Al Rahahleh & Bhatti", year: 2023, market: "Emerging", level: "Funds", focus: "Risk-adjusted",
    finding: "same", note: "No statistically significant overall performance difference." },
  { study: "Hasan", year: 2024, market: "Bangladesh", level: "Funds", focus: "Risk",
    finding: "better", note: "Lower risk exposure in both univariate and panel settings, but only 2 Islamic funds against 27." },
  { study: "This dissertation", year: 2025, market: "United Kingdom", level: "Funds", focus: "Risk",
    finding: "same", note: "No significant difference in volatility, beta, idiosyncratic risk or factor-adjusted return.", self: true },
];

export const FINDING_LABELS = {
  better: "Islamic lower risk / better",
  same: "No significant difference",
  worse: "Islamic higher risk / worse",
  mixed: "Depends on the specification",
  "n/a": "Method paper",
};

/* ------------------------------------------------------------
   References: the works cited on this page, Harvard style,
   as they appear in the dissertation's reference list.
   ------------------------------------------------------------ */
export const REFERENCES = [
  "Abdelsalam, O., Duygun, M., Matallín-Sáez, J.C. and Tortosa-Ausina, E. (2014) ‘Do ethics imply persistence? The case of Islamic and socially responsible funds’, Journal of Banking & Finance, 40, pp. 182–194.",
  "Ang, A., Hodrick, R.J., Xing, Y. and Zhang, X. (2006) ‘The cross-section of volatility and expected returns’, The Journal of Finance, 61(1), pp. 259–299.",
  "Bank of England (2024) UK 3-month Treasury Bill yield. Bank of England statistical database.",
  "Belouafi, A. and Chachi, A. (2014) ‘Islamic finance in the United Kingdom: factors behind its development and growth’, Islamic Economic Studies, 22(1), pp. 37–78.",
  "Bloomberg (2025) Mutual fund last price, 01/01/2018 to 01/07/2025. Bloomberg Terminal.",
  "Carhart, M.M. (1997) ‘On persistence in mutual fund performance’, The Journal of Finance, 52(1), pp. 57–82.",
  "Chekhlov, A., Uryasev, S. and Zabarankin, M. (2005) ‘Drawdown measure in portfolio optimization’, International Journal of Theoretical and Applied Finance, 8(1), pp. 13–58.",
  "Chiu, I.H-Y. (2018) ‘Regulating collective retail investment funds in the United Kingdom with the objective of investor protection’, in Birdthistle, W.A. and Morley, J. (eds.) Research Handbook on the Regulation of Mutual Funds. Cheltenham: Edward Elgar.",
  "Climent, F. and Soriano, P. (2020) ‘Investment performance of U.S. Islamic mutual funds’, Sustainability, 12(9), 3530.",
  "Derwall, J., Koedijk, K. and Ter Horst, J. (2011) ‘A tale of values-driven and profit-seeking social investors’, Journal of Banking & Finance, 35(8), pp. 2137–2147.",
  "El-Gamal, M.A. (2006) Islamic finance: law, economics, and practice. Cambridge: Cambridge University Press.",
  "Ercanbrack, J. (2011) ‘The regulation of Islamic finance in the United Kingdom’, Ecclesiastical Law Journal, 13(1), pp. 69–77.",
  "Fama, E.F. and French, K.R. (1993) ‘Common risk factors in the returns on stocks and bonds’, Journal of Financial Economics, 33(1), pp. 3–56.",
  "Fama, E.F. and French, K.R. (2015) ‘A five-factor asset pricing model’, Journal of Financial Economics, 116(1), pp. 1–22.",
  "French, K.R. (2024) Data library. Tuck School of Business, Dartmouth College.",
  "Hasan, S.M. (2024) ‘Does Islamic mutual fund bear higher risk than conventional mutual fund? An empirical analysis from Bangladesh’, Jahangirnagar University Journal of Business Research, 24(1).",
  "Hayat, R. and Kraeussl, R. (2011) ‘Risk and return characteristics of Islamic equity funds’, Emerging Markets Review, 12(2), pp. 189–203.",
  "Herskovic, B., Kelly, B., Lustig, H. and Van Nieuwerburgh, S. (2016) ‘The common factor in idiosyncratic volatility’, Journal of Financial Economics, 119(2), pp. 249–283.",
  "Ho, C.S.F., Abd Rahman, N.A., Yusuf, N.H.M. and Zamzamin, Z. (2014) ‘Performance of global Islamic versus conventional share indices: international evidence’, Pacific-Basin Finance Journal, 28, pp. 110–121.",
  "Hoepner, A.G.F., Rammal, H.G. and Rezec, M. (2011) ‘Islamic mutual funds’ financial performance and international investment style: evidence from 20 countries’, The European Journal of Finance, 17(9–10), pp. 829–850.",
  "Jensen, M.C. (1968) ‘The performance of mutual funds in the period 1945–1964’, The Journal of Finance, 23(2), pp. 389–416.",
  "Magdon-Ismail, M. and Atiya, A.F. (2004) ‘Maximum drawdown’, Risk Magazine, 17(10), pp. 99–102.",
  "Mansor, F. and Bhatti, M.I. (2011) ‘Risk and return analysis on performance of Islamic mutual funds: evidence from Malaysia’, Global Economy and Finance Journal, 4(1), pp. 19–31.",
  "Markowitz, H. (1952) ‘Portfolio selection’, The Journal of Finance, 7(1), pp. 77–91.",
  "Mirza, N., Rizvi, S.K.A., Saba, I., Naqvi, B. and Yarovaya, L. (2022) ‘The resilience of Islamic equity funds during COVID-19’, International Review of Economics & Finance, 77, pp. 276–295.",
  "Nainggolan, Y.A., How, J. and Verhoeven, P. (2016) ‘Ethical screening and financial performance: the case of Islamic equity funds’, Journal of Business Ethics, 137(1), pp. 83–99.",
  "Naveed, F., Khawaja, I. and Maroof, L. (2020) ‘Are Islamic mutual funds exposed to lower risk compared to their conventional counterparts?’, ISRA International Journal of Islamic Finance, 12(1), pp. 69–87.",
  "Newey, W.K. and West, K.D. (1987) ‘A simple, positive semi-definite, heteroskedasticity and autocorrelation consistent covariance matrix’, Econometrica, 55(3), pp. 703–708.",
  "Petersen, M.A. (2009) ‘Estimating standard errors in finance panel data sets: comparing approaches’, The Review of Financial Studies, 22(1), pp. 435–480.",
  "Reddy, K., Mirza, N., Naqvi, B. and Fu, M. (2017) ‘Comparative risk adjusted performance of Islamic, socially responsible and conventional funds: evidence from United Kingdom’, Economic Modelling, 66, pp. 233–243.",
  "Renneboog, L., Ter Horst, J. and Zhang, C. (2008) ‘The price of ethics and stakeholder governance: the performance of socially responsible mutual funds’, Journal of Corporate Finance, 14(3), pp. 302–322.",
  "Sharpe, W.F. (1964) ‘Capital asset prices: a theory of market equilibrium under conditions of risk’, The Journal of Finance, 19(3), pp. 425–442.",
  "Sharpe, W.F. (1966) ‘Mutual fund performance’, The Journal of Business, 39(1), pp. 119–138.",
  "Statman, M. and Glushkov, D. (2009) ‘The wages of social responsibility’, Financial Analysts Journal, 65(4), pp. 33–46.",
  "Treynor, J.L. (1965) ‘How to rate management of investment funds’, Harvard Business Review, 43(1), pp. 63–75.",
  "Walkshäusl, C. and Lobe, S. (2012) ‘Islamic investing’, Review of Financial Economics, 21(2), pp. 53–62.",
];

/* ============================================================
   THE SERIES, extracted from the charts embedded in the
   submitted document. Generated, not hand-typed.
   ============================================================ */
/* UKX = FTSE 100 monthly close, Jan 2018 - Jul 2025 (91 months). */

export const UKX = [
  7533.55, 7231.91, 7056.61, 7509.3, 7678.2, 7636.93, 7748.76, 7432.42, 7510.2, 7128.1,
  6980.24, 6728.13, 6968.85, 7074.73, 7279.19, 7418.22, 7161.71, 7425.63, 7586.78, 7207.18,
  7408.21, 7248.38, 7346.53, 7542.44, 7286.01, 6580.61, 5671.96, 5901.21, 6076.6, 6169.74,
  5897.76, 5963.57, 5866.1, 5577.27, 6266.19, 6460.52, 6407.46, 6483.43, 6713.63, 6969.81,
  7022.61, 7037.47, 7032.3, 7119.7, 7086.42, 7237.57, 7059.45, 7384.54, 7464.37, 7458.25,
  7515.68, 7544.55, 7607.66, 7169.28, 7423.43, 7284.15, 6893.81, 7094.53, 7573.05, 7451.74,
  7771.7, 7876.28, 7631.74, 7870.57, 7446.14, 7531.53, 7699.41, 7439.13, 7608.08, 7321.72,
  7453.75, 7733.24, 7630.57, 7630.02, 7952.62, 8144.13, 8275.38, 8164.12, 8367.98, 8376.63,
  8236.95, 8110.1, 8287.3, 8173.02, 8673.96, 8809.74, 8582.81, 8494.85, 8772.38, 8760.96,
  9132.81,
];

export const UKX_FROM = "2018-01";

/* MIGB monthly close, Feb 2018 - Jul 2025 (90 months). */

export const MIGB = [
  1283.3, 1244.66, 1352.33, 1415.38, 1406.46, 1408.0, 1345.31, 1400.32, 1343.71, 1284.09,
  1264.22, 1312.69, 1345.95, 1384.01, 1390.8, 1350.7, 1423.3, 1411.67, 1278.55, 1318.55,
  1261.28, 1279.99, 1310.29, 1228.15, 1071.36, 879.36, 880.19, 913.24, 938.25, 889.16,
  896.57, 845.88, 799.94, 963.56, 1023.5, 1039.88, 1113.88, 1098.4, 1137.24, 1128.65,
  1140.32, 1160.06, 1136.56, 1135.19, 1141.53, 1117.37, 1170.07, 1239.56, 1292.02, 1345.2,
  1337.57, 1411.08, 1240.41, 1285.85, 1299.95, 1272.31, 1328.91, 1439.05, 1402.52, 1457.57,
  1466.84, 1376.82, 1406.26, 1274.51, 1311.71, 1362.24, 1325.76, 1411.56, 1380.47, 1398.33,
  1435.24, 1385.65, 1370.28, 1450.18, 1531.06, 1516.36, 1503.25, 1500.55, 1484.29, 1453.67,
  1427.29, 1415.14, 1377.28, 1449.35, 1431.21, 1421.96, 1291.14, 1307.1, 1307.1, 1307.1,
];

export const MIGB_FROM = "2018-02";

export const DD_CONVENTIONAL = [
  0.0, -0.014753, -0.036635, -0.017033, -0.007806, -0.011402, -0.007075, -0.01093,
  -0.014392, -0.053377, -0.055487, -0.089129, -0.056225, -0.045112, -0.028306, -0.013659,
  -0.031742, -0.011841, -0.00752, -0.025055, -0.016226, -0.030019, -0.018124, -0.015577,
  -0.018896, -0.062261, -0.148029, -0.096171, -0.067855, -0.055485, -0.05968, -0.051157,
  -0.05303, -0.068194, -0.027078, -0.019707, -0.028192, -0.033866, -0.024781, -0.019802,
  -0.019951, -0.015229, -0.013054, -0.008661, -0.028313, -0.016191, -0.019489, -0.019091,
  -0.055941, -0.071801, -0.056328, -0.082795, -0.092591, -0.136492, -0.099097, -0.114852,
  -0.167913, -0.152571, -0.121273, -0.143298, -0.113634, -0.121981, -0.12198, -0.121455,
  -0.131646, -0.119424, -0.106499, -0.118455, -0.124123, -0.146658, -0.112191, -0.087178,
  -0.095095, -0.090479, -0.079885, -0.094163, -0.086417, -0.083295, -0.080185, -0.07939,
  -0.078942, -0.085019, -0.077499, -0.090591, -0.074166, -0.085683, -0.116578, -0.122218,
  -0.098103, -0.08486, -0.073659,
];

export const DD_ISLAMIC = [
  null, 0.0, -0.029851, -0.008613, 0.0, -0.006305, -0.004605, -0.014186,
  -0.019317, -0.069421, -0.065452, -0.111609, -0.084766, -0.067462, -0.032395, -0.027786,
  -0.060494, -0.033998, -0.030289, -0.046735, -0.029764, -0.038319, -0.022377, -0.015175,
  -0.023891, -0.071973, -0.131361, -0.06309, -0.054026, -0.051213, -0.059041, -0.052573,
  -0.059217, -0.086296, -0.03987, -0.03482, -0.03559, -0.048006, -0.022154, -0.011161,
  -0.022462, -0.008435, -0.006515, -0.001975, -0.033734, -0.009263, -0.00993, 0.0,
  -0.040923, -0.073968, -0.036338, -0.073383, -0.08081, -0.11673, -0.063431, -0.07831,
  -0.133025, -0.124625, -0.091599, -0.134856, -0.09383, -0.103941, -0.073702, -0.072861,
  -0.052718, -0.032677, -0.024816, -0.030622, -0.042156, -0.059552, -0.02841, -0.020432,
  -0.023576, -0.021287, -0.011646, -0.027548, -0.002721, -0.005282, -0.014197, -0.013991,
  -0.01319, -0.004291, -0.006488, -0.014657, -0.008175, -0.032464, -0.097019, -0.121568,
  -0.081695, -0.053954, -0.014541,
];

export const DD_FROM = "2018-01";

export const FUND_SD = [
  0.001761, 0.00177, 0.003023, 0.00656, 0.006761, 0.009479, 0.0102, 0.012897,
  0.014159, 0.014184, 0.014741, 0.014966, 0.015893, 0.01667, 0.01694, 0.017656,
  0.019108, 0.019307, 0.01932, 0.019481, 0.019717, 0.019925, 0.020271, 0.020271,
  0.020276, 0.020334, 0.020402, 0.02044, 0.020649, 0.020683, 0.020714, 0.020809,
  0.021181, 0.021201, 0.021555, 0.021982, 0.022136, 0.022145, 0.022153, 0.022379,
  0.02255, 0.022605, 0.02289, 0.023475, 0.023876, 0.024199, 0.024275, 0.024451,
  0.024562, 0.024605, 0.024616, 0.024845, 0.024885, 0.025026, 0.025102, 0.025259,
  0.025298, 0.025457, 0.02556, 0.025628, 0.025679, 0.02589, 0.02591, 0.02607,
  0.02643, 0.02655, 0.026851, 0.026866, 0.027099, 0.0273, 0.027344, 0.027649,
  0.027727, 0.027876, 0.028496, 0.028953, 0.02909, 0.0293, 0.029343, 0.029344,
  0.029494, 0.029893, 0.030072, 0.030155, 0.030177, 0.030394, 0.030633, 0.03083,
  0.030962, 0.030994, 0.031092, 0.031161, 0.03221, 0.032976, 0.03302, 0.033034,
  0.033703, 0.033706, 0.033747, 0.033841, 0.034812, 0.034831, 0.03491, 0.035034,
  0.035048, 0.035727, 0.035745, 0.035747, 0.035874, 0.035981, 0.036428, 0.036586,
  0.036651, 0.036824, 0.03684, 0.036922, 0.036946, 0.037119, 0.037136, 0.037279,
  0.037333, 0.037385, 0.037387, 0.037413, 0.03748, 0.037523, 0.037545, 0.037656,
  0.037742, 0.037921, 0.038005, 0.038073, 0.038173, 0.038212, 0.03834, 0.038515,
  0.038528, 0.038552, 0.038562, 0.038694, 0.038768, 0.03889, 0.039244, 0.03929,
  0.039328, 0.039355, 0.039435, 0.03963, 0.039836, 0.039847, 0.039853, 0.039939,
  0.040082, 0.040112, 0.040214, 0.040249, 0.040286, 0.040326, 0.040365, 0.04049,
  0.040533, 0.040708, 0.040767, 0.040979, 0.041029, 0.041329, 0.041406, 0.041562,
  0.041811, 0.042198, 0.042252, 0.042274, 0.042433, 0.042796, 0.042818, 0.042853,
  0.043264, 0.043463, 0.043685, 0.04371, 0.044125, 0.044158, 0.044233, 0.044551,
  0.045095, 0.045537, 0.045767, 0.045837, 0.045876, 0.045889, 0.046051, 0.047704,
  0.048883, 0.049274, 0.049513, 0.050483, 0.05062, 0.050775, 0.051194, 0.052667,
  0.053195, 0.053226, 0.053377, 0.053528, 0.053901, 0.055092, 0.056265, 0.058315,
  0.058613, 0.060299, 0.068787, 0.075739, 0.076575, 0.08275, 0.175087, 0.486502,
];

export const EXCESS_HIST = {
  lo: -0.4, width: 0.005,
  below: [-0.627532, -1.128601, -4.710684],
  above: [1.129513],
  bins: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 2, 2, 4, 0, 0, 3, 1, 4, 2, 5, 1,
    3, 7, 12, 12, 16, 13, 30, 34, 43, 52, 65, 85, 120, 133,
    208, 326, 336, 366, 471, 566, 561, 582, 583, 482, 464, 420, 368, 375,
    332, 248, 258, 293, 256, 246, 245, 249, 260, 241, 300, 350, 393, 380,
    595, 531, 598, 476, 518, 512, 477, 482, 522, 597, 595, 479, 392, 333,
    326, 311, 242, 199, 155, 118, 94, 70, 52, 44, 34, 33, 30, 24,
    22, 26, 8, 14, 7, 12, 10, 11, 7, 7, 3, 2, 2, 2,
    2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0,
    1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  ],
};

export const EXCESS_STATS = {
  n: 19797,
  mean: -0.073179,
  sd: 0.082235,
  skew: -9.0262,
  exkurt: 513.087,
  min: -4.710684,
  max: 1.129513,
  q: {
    0.001: -0.275928,
    0.01: -0.215173,
    0.05: -0.183062,
    0.25: -0.142205,
    0.5: -0.061865,
    0.75: -0.011677,
    0.95: 0.035251,
    0.99: 0.080275,
    0.999: 0.142054
  }
};
