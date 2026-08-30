/* ============================================================
   stock.js: the page. All the DOM, none of the judgement.

   Every number displayed here comes out of stock.model.js and
   every word out of stock.i18n.js. This file's job is to put
   them on screen, keep them in step with the inputs, and draw
   six charts without a chart library.

   THE LANGUAGE SWITCH

   Static text carries data-i18n and is filled in on load and on
   every switch. Generated text asks t() for the same keys. The
   whole page, including the numerals, which become Bengali
   digits through Intl, re-renders on a switch, so there is no
   state that can be left behind in the other language.

   The choice is written to localStorage and read by an inline
   script in the page head before first paint, so a returning
   reader never sees a flash of English before their Bangla
   arrives.

   SAVING A CHECK

   Forty-odd inputs is enough work that doing it twice is a
   reason not to do it once. The page has always encoded all of
   them in its own query string, so a filled-in check has always
   been shareable as a link; what it could not do was keep one.

   It keeps them on the ACCOUNT and nowhere else. There is no
   local list, no "saved on this device", and a signed-out reader
   sees no panel at all rather than a panel that tells them to
   sign in: what they had before this existed, the URL in the
   address bar and the button that copies it, is untouched. The
   stored row holds that same query string, so opening a saved
   check is a link, and the format the page reads is the format
   it writes, once.
   ============================================================ */

import {
  DEFAULTS, SECTORS, INDICES, METRICS, PILLARS, WEIGHT_PRESETS, PRESETS,
  analyse, presetInput, isFinancialSector, grade,
} from "/tools/stock.model.js";
import {
  t, fmtNum, fmtInt, fmtValue, fmtLakh, fmtTk,
} from "/tools/stock.i18n.js";
import { current } from "/account.js";
import { listScenarios, saveScenario, removeScenario } from "/saved.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* The green portion of a range input is a background gradient sized
   by --pct on the wrapping .driver. It has to be set for EVERY
   slider and refreshed on every change: the weight sliders were
   built without it and sat at the stylesheet's 50% default
   regardless of their value, so "Growth 15%" showed a thumb at 37%
   above a bar filled to half. Anything that owns a range input
   calls this. */
function paintRange(rng) {
  if (!rng) return;
  const min = Number(rng.min);
  const max = Number(rng.max);
  const pct = max > min ? ((Number(rng.value) - min) / (max - min)) * 100 : 0;
  const host = rng.closest(".driver") ?? rng.parentElement;
  host?.style.setProperty("--pct", `${Math.max(0, Math.min(100, pct)).toFixed(2)}%`);
}

/* ============================================================
   STATE
   ============================================================ */

let lang = "en";
/* Whether the language was CHOSEN, by a ?lang= param or by
   clicking the switcher, as opposed to defaulting. Only a chosen
   language is written back into the URL: otherwise a reader who
   opens ?lang=en, edits an input and copies the link hands over a
   URL with no lang at all, which reopens in Bangla for anyone
   whose stored preference says so. The link should show what the
   sender was looking at. */
let langExplicit = false;
let state = { ...DEFAULTS };
let weights = { ...WEIGHT_PRESETS.balanced };
let style = "balanced";

/* ============================================================
   THE INPUT SPEC

   One entry per field. `slider` turns it into a range plus a
   number box that stay in sync, used for the assumptions you
   want to feel your way around (price, the benchmark rates)
   rather than the statement figures, which you copy off a
   report and type once.
   ============================================================ */

/* `quick: true` is the shorter way in.

   ELEVEN FIELDS, and they are not the eleven that are easiest to
   type: they are the ones the six pillars are most sensitive to,
   which is why value, profitability, balance, cash and dividend
   are all represented. Everything left out keeps the sector's
   typical figure, which is what the example presets load, so a
   quick check is a real check against an assumed background
   rather than a different model. `depth.quickNote` says exactly
   that to the reader, because a score computed partly from
   somebody else's numbers has to say so. */
const FIELDS = [
  { g: "company", id: "name", text: true, quick: true },
  { g: "company", id: "ticker", text: true, quick: true, wide: false },
  { g: "company", id: "price", step: 0.1, slider: [1, 500, 0.5], quick: true },
  { g: "company", id: "shares", step: 1, quick: true },
  { g: "company", id: "sector", select: Object.keys(SECTORS), prefix: "sector.", quick: true },
  { g: "company", id: "category", select: ["A", "B", "N", "Z"], plain: true },
  { g: "company", id: "benchmark", select: Object.keys(INDICES), plain: true },
  { g: "company", id: "high52", step: 0.1 },
  { g: "company", id: "low52", step: 0.1 },
  { g: "company", id: "ma50", step: 0.1 },
  { g: "company", id: "ma200", step: 0.1 },
  { g: "company", id: "turnover", step: 1, slider: [0, 500, 1] },
  { g: "company", id: "freeFloat", step: 1, slider: [0, 100, 1] },
  { g: "company", id: "stockReturn12m", step: 1, slider: [-80, 150, 1] },
  { g: "company", id: "indexReturn12m", step: 1, slider: [-50, 80, 1] },

  { g: "income", id: "revenue", step: 100, quick: true },
  { g: "income", id: "grossProfit", step: 100 },
  { g: "income", id: "ebit", step: 100 },
  { g: "income", id: "depreciation", step: 50 },
  { g: "income", id: "interestExpense", step: 50 },
  { g: "income", id: "netIncome", step: 100, quick: true },

  { g: "balance", id: "totalAssets", step: 100, quick: true },
  { g: "balance", id: "currentAssets", step: 100 },
  { g: "balance", id: "inventory", step: 100 },
  { g: "balance", id: "cash", step: 100, quick: true },
  { g: "balance", id: "currentLiabilities", step: 100 },
  { g: "balance", id: "totalDebt", step: 100, quick: true },
  { g: "balance", id: "equity", step: 100, quick: true },
  { g: "balance", id: "reserves", step: 100 },

  { g: "cash", id: "cfo", step: 100, quick: true },
  { g: "cash", id: "capex", step: 100 },

  { g: "dividend", id: "dps", step: 0.1, slider: [0, 30, 0.1], quick: true },
  { g: "dividend", id: "divTax", step: 1, slider: [0, 30, 1] },
  { g: "dividend", id: "yearsPaid", step: 1, slider: [0, 25, 1] },

  { g: "prior", id: "revenuePrev", step: 100 },
  { g: "prior", id: "grossProfitPrev", step: 100 },
  { g: "prior", id: "netIncomePrev", step: 100 },
  { g: "prior", id: "totalAssetsPrev", step: 100 },
  { g: "prior", id: "currentAssetsPrev", step: 100 },
  { g: "prior", id: "currentLiabilitiesPrev", step: 100 },
  { g: "prior", id: "totalDebtPrev", step: 100 },
  { g: "prior", id: "cfoPrev", step: 100 },
  { g: "prior", id: "sharesPrev", step: 1 },
  { g: "prior", id: "netIncome3y", step: 100 },

  { g: "bank", id: "car", step: 0.1, slider: [0, 25, 0.1] },
  { g: "bank", id: "npl", step: 0.1, slider: [0, 30, 0.1] },
  { g: "bank", id: "provisionCover", step: 1, slider: [0, 200, 1] },
  { g: "bank", id: "costIncome", step: 1, slider: [0, 100, 1] },
  { g: "bank", id: "adr", step: 0.1, slider: [0, 110, 0.5] },

  { g: "benchmarks", id: "sectorPE", step: 0.1, slider: [3, 40, 0.1] },
  { g: "benchmarks", id: "sectorPB", step: 0.1, slider: [0.2, 10, 0.1] },
  { g: "benchmarks", id: "sectorROE", step: 0.5, slider: [0, 50, 0.5] },
  { g: "benchmarks", id: "sectorMargin", step: 0.5, slider: [0, 40, 0.5] },
  { g: "benchmarks", id: "marketPE", step: 0.1, slider: [4, 30, 0.1] },
  { g: "benchmarks", id: "riskFree", step: 0.01, slider: [0, 20, 0.05] },
  { g: "benchmarks", id: "fdr", step: 0.1, slider: [0, 15, 0.1] },
  { g: "benchmarks", id: "inflation", step: 0.1, slider: [0, 25, 0.1] },
  { g: "benchmarks", id: "nonCompliantIncome", step: 0.5, slider: [0, 40, 0.5] },
];

const GROUPS = ["company", "income", "balance", "cash", "dividend", "prior", "bank", "benchmarks"];
const OPEN_BY_DEFAULT = new Set(["company", "income"]);

/* HOW MUCH OF THE FORM TO SHOW, and it is a view setting rather
   than an input: the model reads the same eighty-five values
   either way, and what changes is how many of them a reader is
   asked to type. So it is not in `DEFAULTS`, it is skipped by
   `readUrl` alongside `lang` and `style`, and it lives in
   `reader-prefs` where the rest of the reader's choices are.

   `tool-depth` is the calculator's own spelling of that field,
   written by `aab/src/prefs.ts` and read here, so this file needs
   no JSON parse before its first render. */
let depth = "quick";
try {
  const stored = localStorage.getItem("tool-depth");
  if (stored === "quick" || stored === "all") depth = stored;
} catch { /* private mode: quick, which is the friendlier default */ }

const shownIn = (f) => depth === "all" || f.quick === true;

/* ============================================================
   URL STATE, an analysis you can send someone
   ============================================================ */

function readUrl() {
  const p = new URLSearchParams(location.search);
  const out = {};
  let handSet = false;
  for (const [k, v] of p) {
    if (k === "lang" || k === "style") continue;
    if (k === "depth") { if (v === "quick" || v === "all") depth = v; continue; }
    if (k in DEFAULTS) {
      out[k] = typeof DEFAULTS[k] === "number" ? Number(v) : v;
    } else if (k.startsWith("w.") && PILLARS.includes(k.slice(2))) {
      weights[k.slice(2)] = Number(v);
      handSet = true;
    }
  }
  if (p.get("style") && WEIGHT_PRESETS[p.get("style")]) {
    style = p.get("style");
    weights = { ...WEIGHT_PRESETS[style] };
  } else if (handSet) {
    /* A link carrying its own weights is not any of the four
       presets, so none of them should show as chosen: the chip
       would be claiming weights the page is not using. */
    style = "custom";
  }
  if (p.get("lang") === "bn" || p.get("lang") === "en") { lang = p.get("lang"); langExplicit = true; }
  return out;
}

function writeUrl() {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(state)) {
    if (DEFAULTS[k] !== v) p.set(k, v);
  }
  for (const k of PILLARS) {
    if (weights[k] !== WEIGHT_PRESETS.balanced[k]) p.set(`w.${k}`, weights[k]);
  }
  if (lang !== "en" || langExplicit) p.set("lang", lang);
  /* Carried on the link, so a check somebody sends opens the way
     they were looking at it. */
  if (depth !== "quick") p.set("depth", depth);
  const q = p.toString();
  history.replaceState(null, "", q ? `?${q}${location.hash}` : location.pathname + location.hash);
}

/* ============================================================
   LANGUAGE
   ============================================================ */

function applyLang(next, { save = true } = {}) {
  lang = next;
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  if (save) { try { localStorage.setItem("tool-lang", lang); } catch { /* private mode */ } }

  for (const node of $$("[data-i18n]")) node.textContent = t(node.dataset.i18n, lang);
  for (const node of $$("[data-i18n-html]")) node.innerHTML = t(node.dataset.i18nHtml, lang);
  for (const node of $$("[data-i18n-aria]"))
    node.setAttribute("aria-label", t(node.dataset.i18nAria, lang));

  for (const b of $$("#lang-switch button")) {
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
  }
  document.title = lang === "bn"
    ? "শেয়ার যাচাই · কিনবেন, ধরে রাখবেন, নাকি বেচবেন · Reiad's Library"
    : "Stock check · buy, hold or sell · Reiad's Library";

  localiseCrumbs();
  /* Before `buildInputs`, because the note under the switch is
     translated like everything else and the switch decides what
     `buildInputs` draws. */
  paintDepth();
  buildInputs();
  render();
}

/* The breadcrumb is put in place by /crumbs.js at page load, in
   whatever language the document was in then. Rather than tear
   it down and rebuild it, which would duplicate its JSON-LD,
   the three labels are swapped in place. */
function localiseCrumbs() {
  const nav = $(".crumbs");
  if (!nav) return;
  nav.setAttribute("aria-label", lang === "bn" ? "পথ" : "Breadcrumb");
  const labels = {
    "/": { en: "Home", bn: "হোম" },
    "/tools": { en: "Tools", bn: "টুল" },
  };
  for (const a of $$("a", nav)) {
    const m = labels[a.getAttribute("href")];
    if (m) a.textContent = m[lang];
  }
  const last = $("li[aria-current]", nav);
  if (last) last.textContent = lang === "bn" ? "শেয়ার যাচাই" : "Stock check";
}

/* ============================================================
   THE INPUT PANEL
   ============================================================ */

function buildInputs() {
  const host = $("#drivers");
  if (!host) return;
  const openNow = new Set($$("details[data-group]", host).filter((d) => d.open)
    .map((d) => d.dataset.group));
  host.textContent = "";

  for (const g of GROUPS) {
    const fields = FIELDS.filter((f) => f.g === g && shownIn(f));
    if (!fields.length) continue;

    const box = el("details", "driver-group");
    box.dataset.group = g;
    box.open = openNow.size ? openNow.has(g) : OPEN_BY_DEFAULT.has(g);
    if (g === "bank") box.hidden = !isFinancialSector(state.sector);

    const sum = el("summary", null, `<h3>${esc(t(`g.${g}`, lang))}</h3>`);
    box.append(sum);

    if (g === "prior" || g === "bank" || g === "benchmarks") {
      box.append(el("p", "drivers-note", esc(t(`g.${g}Note`, lang))));
    }

    for (const f of fields) box.append(fieldNode(f));
    host.append(box);
  }
}

/** The switch's own state and the sentence under it. Called by
    `applyLang` as well, because the note is translated. */
function paintDepth() {
  for (const b of $$("#depth-switch button[data-depth]")) {
    b.setAttribute("aria-pressed", String(b.dataset.depth === depth));
  }
  const note = $("#depth-note");
  if (note) note.textContent = t(depth === "quick" ? "depth.quickNote" : "depth.allNote", lang);
}

function fieldNode(f) {
  const wrap = el("label", "driver");
  wrap.dataset.field = f.id;

  const row = el("div", "label-row");
  row.append(el("span", null, esc(t(`i.${f.id}`, lang))));
  const val = el("span", "val");
  val.id = `val-${f.id}`;
  row.append(val);
  wrap.append(row);

  if (f.select) {
    const sel = el("select", "field-select");
    sel.id = `in-${f.id}`;
    for (const opt of f.select) {
      const o = el("option");
      o.value = opt;
      o.textContent = f.plain ? opt : t(`${f.prefix}${opt}`, lang);
      if (state[f.id] === opt) o.selected = true;
      sel.append(o);
    }
    sel.addEventListener("change", () => {
      state[f.id] = sel.value;
      if (f.id === "sector") onSectorChange();
      if (f.id === "benchmark") onBenchmarkChange();
      commit();
    });
    wrap.append(sel);
    val.textContent = "";
    return wrap;
  }

  /* A LABEL RATHER THAN A NUMBER. `name` and `ticker` are the two,
     nothing in `analyse()` reads either, and they are what make an
     analysis be ABOUT something: the save box offers the company's
     own name, and `/tools/live` finds the check somebody did on a
     holding by its ticker. */
  if (f.text) {
    const box = el("input", "field-text");
    box.type = "text";
    box.id = `in-${f.id}`;
    box.maxLength = 60;
    box.value = String(state[f.id] ?? "");
    box.placeholder = f.id === "ticker" ? "SQURPHARMA" : "Square Pharmaceuticals";
    box.addEventListener("input", () => {
      state[f.id] = box.value.slice(0, 60);
      commit();
    });
    wrap.append(box);
    wrap.append(el("p", "driver-note", esc(t(`f.${f.id}`, lang))));
    val.textContent = "";
    return wrap;
  }

  const num = el("input", "field-num");
  num.type = "number";
  num.id = `in-${f.id}`;
  num.step = String(f.step ?? 1);
  num.value = String(state[f.id]);
  wrap.append(num);

  let range = null;
  if (f.slider) {
    range = el("input");
    range.type = "range";
    range.id = `rng-${f.id}`;
    [range.min, range.max, range.step] = f.slider.map(String);
    range.value = String(state[f.id]);
    range.setAttribute("aria-label", t(`i.${f.id}`, lang));
    wrap.append(range);
  }

  const set = (v, from) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    state[f.id] = n;
    if (from !== "num") num.value = String(n);
    if (range && from !== "rng") range.value = String(n);
    paintRange(range);
    commit();
  };
  num.addEventListener("input", () => set(num.value, "num"));
  if (range) range.addEventListener("input", () => set(range.value, "rng"));
  paintRange(range);

  return wrap;
}

/* Choosing an index has to move the index P/E, or the picker is a
   control that looks live and is not, which is exactly what it
   was: selecting DS30 changed nothing anywhere on the page. */
function onBenchmarkChange() {
  const idx = INDICES[state.benchmark];
  if (!idx) return;
  state.marketPE = idx.pe;
  const n = $("#in-marketPE");
  const r = $("#rng-marketPE");
  if (n) n.value = String(state.marketPE);
  if (r) r.value = String(state.marketPE);
  paintRange(r);
}

/* Picking a bank swaps in the ratios a bank is actually
   supervised on, and swaps out the ones that mean nothing for
   one. The sector benchmarks follow too, unless they have been
   edited away from the sector's own defaults. */
function onSectorChange() {
  const s = SECTORS[state.sector];
  if (s) {
    state.sectorPE = s.pe;
    state.sectorPB = s.pb;
    state.sectorROE = s.roe;
    state.sectorMargin = s.netMargin;
    for (const id of ["sectorPE", "sectorPB", "sectorROE", "sectorMargin"]) {
      const n = $(`#in-${id}`);
      const r = $(`#rng-${id}`);
      if (n) n.value = String(state[id]);
      if (r) r.value = String(state[id]);
    }
  }
  const bank = $('details[data-group="bank"]');
  if (bank) {
    bank.hidden = !isFinancialSector(state.sector);
    if (!bank.hidden) bank.open = true;
  }
}

/* ============================================================
   WEIGHTS
   ============================================================ */

function buildWeights() {
  const host = $("#weights");
  if (!host) return;
  host.textContent = "";

  const row = el("div", "scenarios");
  for (const s of Object.keys(WEIGHT_PRESETS)) {
    const b = el("button", "scenario", esc(t(`style.${s}`, lang)));
    b.type = "button";
    b.dataset.style = s;
    b.setAttribute("aria-pressed", String(style === s));
    b.addEventListener("click", () => {
      style = s;
      weights = { ...WEIGHT_PRESETS[s] };
      buildWeights();
      commit();
    });
    row.append(b);
  }
  host.append(row);

  for (const p of PILLARS) {
    const wrap = el("label", "driver");
    const lr = el("div", "label-row");
    lr.append(el("span", null, esc(t(`pillar.${p}`, lang))));
    const v = el("span", "val", `${fmtInt(weights[p], lang)}%`);
    lr.append(v);
    wrap.append(lr);

    const r = el("input");
    r.type = "range";
    r.min = "0"; r.max = "40"; r.step = "1";
    r.value = String(weights[p]);
    r.setAttribute("aria-label", t(`pillar.${p}`, lang));
    r.addEventListener("input", () => {
      weights[p] = Number(r.value);
      v.textContent = `${fmtInt(weights[p], lang)}%`;
      paintRange(r);
      style = "custom";
      for (const b of $$("#weights .scenario")) b.setAttribute("aria-pressed", "false");
      commit();
    });
    wrap.append(r);
    host.append(wrap);
    paintRange(r);
  }
}

/* ============================================================
   DRAWING, six charts, no library
   ============================================================ */

/** The score dial: a 240° arc, filled to the score. */
function dial(score, tone) {
  const R = 54, CX = 64, CY = 64;
  const START = 150, SWEEP = 240;
  const pt = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return [CX + R * Math.cos(rad), CY + R * Math.sin(rad)];
  };
  const arc = (from, to) => {
    const [x0, y0] = pt(from);
    const [x1, y1] = pt(to);
    const large = to - from > 180 ? 1 : 0;
    return `M${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
  };
  const pctv = Math.max(0, Math.min(100, score ?? 0)) / 100;
  const end = START + SWEEP * pctv;

  /* band edges as ticks, so the reader can see where the verdict
     would change rather than being told a number in isolation */
  const ticks = [35, 48, 62, 75].map((v) => {
    const [x, y] = pt(START + SWEEP * (v / 100));
    const [xi, yi] = (() => {
      const rad = ((START + SWEEP * (v / 100)) * Math.PI) / 180;
      return [CX + (R - 9) * Math.cos(rad), CY + (R - 9) * Math.sin(rad)];
    })();
    return `<line x1="${xi.toFixed(1)}" y1="${yi.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="dial-tick"/>`;
  }).join("");

  return `<svg viewBox="0 0 128 118" class="dial" role="img"
      aria-label="${esc(t("verdict.score", lang))} ${fmtInt(score ?? 0, lang)}">
    <path d="${arc(START, START + SWEEP)}" class="dial-track"/>
    ${score === null ? "" : `<path d="${arc(START, end)}" class="dial-fill" data-tone="${tone}"/>`}
    ${ticks}
    <text x="64" y="70" class="dial-value" data-tone="${tone}">${score === null ? "–" : fmtInt(score, lang)}</text>
    <text x="64" y="88" class="dial-cap">${esc(t("verdict.outOf", lang))}</text>
  </svg>`;
}

/** A horizontal bar, 0–100, coloured by grade. */
function bar(score, gradeName) {
  const w = score === null ? 0 : Math.max(0, Math.min(100, score));
  return `<span class="score-bar" data-grade="${gradeName}">
    <i style="width:${w.toFixed(1)}%"></i></span>`;
}

/** The fair-value range.

    The first version labelled all five anchors on the track and
    they piled on top of each other the moment two landed close
    together, which they usually do, because that is what a
    tight valuation range means. So only two things are labelled
    here, and they sit on opposite sides of the bar so they can
    never collide: the price above, the median below. The extremes
    are named at the ends, outside the track entirely. Which tick
    is which anchor is answered by the table underneath, where
    there is room to say it properly. */
function fairChart(fair, price) {
  const vals = fair.anchors.map((a) => a.value).filter(Number.isFinite);
  if (!vals.length) return `<p class="statement-note">${esc(t("fv.none", lang))}</p>`;
  const lo = Math.min(...vals, price) * 0.9;
  const hi = Math.max(...vals, price) * 1.1;
  const x = (v) => ((v - lo) / (hi - lo)) * 100;

  const ticks = fair.anchors.map((a) =>
    `<div class="fv-tick" style="left:${x(a.value).toFixed(2)}%"></div>`).join("");

  return `<div class="fv-chart">
    <div class="fv-track">
      <div class="fv-band" style="left:${x(fair.low).toFixed(2)}%;
        width:${(x(fair.high) - x(fair.low)).toFixed(2)}%"></div>
      ${ticks}
      <div class="fv-median" style="left:${x(fair.mid).toFixed(2)}%">
        <i></i><span>${esc(t("fv.median", lang))}<b>${fmtTk(fair.mid, lang)}</b></span>
      </div>
      <div class="fv-price" style="left:${x(price).toFixed(2)}%">
        <i></i><span>${esc(t("fv.price", lang))}<b>${fmtTk(price, lang)}</b></span>
      </div>
    </div>
    <div class="fv-ends">
      <span>${esc(t("fv.lowest", lang))} ${fmtTk(fair.low, lang)}</span>
      <span>${esc(t("fv.highest", lang))} ${fmtTk(fair.high, lang)}</span>
    </div>
  </div>`;
}

/** The 52-week range with the two moving averages marked on it. */
function rangeChart(d, r) {
  const lo = Math.min(d.low52, d.price, d.ma200, d.ma50);
  const hi = Math.max(d.high52, d.price, d.ma200, d.ma50);
  if (!(hi > lo)) return "";
  const x = (v) => ((v - lo) / (hi - lo)) * 100;
  const mark = (v, cls, label) => `<div class="rng-mark ${cls}"
    style="left:${x(v).toFixed(2)}%"><i></i><span>${esc(label)}<b>${fmtTk(v, lang)}</b></span></div>`;

  return `<div class="rng-chart">
    <div class="rng-track">
      <div class="rng-fill" style="width:${x(d.price).toFixed(2)}%"></div>
      ${mark(d.ma200, "is-ma200", lang === "bn" ? "২০০ দিন" : "200d")}
      ${mark(d.ma50, "is-ma50", lang === "bn" ? "৫০ দিন" : "50d")}
      ${mark(d.price, "is-price", lang === "bn" ? "দাম" : "Price")}
    </div>
    <div class="rng-ends">
      <span>${fmtTk(d.low52, lang)} · ${lang === "bn" ? "৫২ সপ্তাহের সর্বনিম্ন" : "52w low"}</span>
      <span>${lang === "bn" ? "৫২ সপ্তাহের সর্বোচ্চ" : "52w high"} · ${fmtTk(d.high52, lang)}</span>
    </div>
  </div>`;
}

/** The yield ladder: what this pays against what safe things pay.

    The after-tax row is here because the withholding input had
    nowhere to land: divTax fed a divYieldNet that this file
    referenced exactly zero times, so the slider moved and nothing
    on the page moved with it. It also happens to be the number
    that matters: the comparison against a sanchayapatra is only
    honest once the dividend has been taxed. */
function yieldChart(d, r) {
  const rows = [
    { k: lang === "bn" ? "এই শেয়ারের লভ্যাংশ" : "This share's dividend", v: r.divYield, tone: "green" },
    ...(d.divTax > 0 ? [{
      k: lang === "bn" ? `লভ্যাংশ: ${fmtNum(d.divTax, lang, 0)}% কর বাদে`
                       : `That dividend after ${fmtNum(d.divTax, lang, 0)}% withholding`,
      v: r.divYieldNet, tone: "green",
    }] : []),
    { k: lang === "bn" ? "এই শেয়ারের আর্নিংস ইল্ড" : "This share's earnings yield", v: r.earningsYield, tone: "green" },
    { k: lang === "bn" ? "সঞ্চয়পত্র" : "Sanchayapatra", v: d.riskFree, tone: "gold" },
    { k: lang === "bn" ? "ব্যাংক এফডিআর" : "Bank FDR", v: d.fdr, tone: "gold" },
    { k: lang === "bn" ? "মূল্যস্ফীতি" : "Inflation", v: d.inflation, tone: "danger" },
  ].filter((x) => Number.isFinite(x.v));
  const max = Math.max(...rows.map((x) => x.v), 1);
  return `<div class="yield-ladder">${rows.map((x) => `
    <div class="yield-row">
      <span class="yield-label">${esc(x.k)}</span>
      <span class="yield-track"><i data-tone="${x.tone}"
        style="width:${Math.max(0, (x.v / max) * 100).toFixed(1)}%"></i></span>
      <span class="yield-value">${fmtNum(x.v, lang, 2)}%</span>
    </div>`).join("")}</div>`;
}

/** DuPont: the same ROE, told three ways. */
function dupontChart(r) {
  if (!Number.isFinite(r.dupontRoe)) return "";
  const parts = [
    { k: lang === "bn" ? "নিট মার্জিন" : "Net margin", v: r.dupontMargin, unit: "%", of: 30 },
    { k: lang === "bn" ? "সম্পদের ব্যবহার" : "Asset turnover", v: r.dupontTurnover, unit: "×", of: 2.5 },
    { k: lang === "bn" ? "লিভারেজ" : "Leverage", v: r.dupontLeverage, unit: "×", of: 4 },
  ];
  return `<div class="dupont">
    ${parts.map((p) => `<div class="dupont-part">
      <span class="dupont-k">${esc(p.k)}</span>
      <span class="dupont-track"><i style="width:${Math.max(2, Math.min(100, (p.v / p.of) * 100)).toFixed(1)}%"></i></span>
      <span class="dupont-v">${fmtNum(p.v, lang, 2)}${p.unit}</span>
    </div>`).join('<div class="dupont-op">×</div>')}
    <div class="dupont-op">=</div>
    <div class="dupont-part is-total">
      <span class="dupont-k">${esc(lang === "bn" ? "ROE" : "ROE")}</span>
      <span class="dupont-track"><i style="width:${Math.max(2, Math.min(100, (r.dupontRoe / 35) * 100)).toFixed(1)}%"></i></span>
      <span class="dupont-v">${fmtNum(r.dupontRoe, lang, 1)}%</span>
    </div>
  </div>`;
}

/* ============================================================
   RENDER
   ============================================================ */

let last = null;

function render() {
  const a = analyse(state, weights);
  last = a;
  const { d, r } = a;

  renderVerdict(a);
  renderTiles(a);
  renderPillars(a);
  renderMarket(a);
  renderFair(a);
  renderSignals(a);
  renderFlags(a);
  renderDupont(a);
  renderPiotroski(a);
  renderDrags(a);
  renderScorecard(a);
  renderShariah(a);

  // keep every slider's fill and read-out in step with its value
  for (const f of FIELDS) {
    if (!f.slider) continue;
    paintRange($(`#rng-${f.id}`));
    const box = $(`#val-${f.id}`);
    if (box) box.textContent = fmtNum(state[f.id], lang, f.step < 1 ? 2 : 0);
  }
  for (const r of $$("#weights input[type=range]")) paintRange(r);
  for (const f of FIELDS) {
    /* A label has no read-out beside it, and `fmtInt` on a
       company name renders NaN. */
    if (f.slider || f.select || f.text) continue;
    const box = $(`#val-${f.id}`);
    if (box) box.textContent = fmtInt(state[f.id], lang);
  }
  writeUrl();
}

/* The tone follows the VERDICT, not the raw score: a run capped
   down to "hold" must not still be painted green just because the
   composite reads 65. */
function toneFor(a) {
  if (a.vetoed) return "bad";
  if (a.score === null) return "warn";
  const rank = ["buy", "accumulate", "hold", "trim", "avoid"].indexOf(a.verdict.id);
  return rank <= 1 ? "good" : rank === 2 ? "warn" : "bad";
}

function renderVerdict(a) {
  const tone = toneFor(a);
  $("#verdict-dial").innerHTML = dial(a.score, tone);
  $("#verdict").dataset.state = tone;

  /* WHICH COMPANY THIS IS ABOUT, where the verdict is, because a
     page that says "worth accumulating" over no name is a page a
     reader can screenshot and later not be able to place. Nothing
     is shown when nothing was typed, which is every reader who
     has not filled the label in. */
  const who = $("#verdict-who");
  if (who) {
    const label = [state.name, state.ticker].filter(Boolean).join(" · ");
    who.hidden = !label;
    who.textContent = label;
  }

  $("#verdict-band").textContent = a.vetoed
    ? t("verdict.vetoed", lang)
    : t(`verdict.${a.verdict.id}`, lang);

  /* When the price ceiling has pulled the verdict down, say so and
     say what the score alone would have concluded. A correction the
     reader cannot see is just a number they have no reason to
     trust. */
  $("#verdict-why").textContent = a.vetoed
    ? t("verdict.vetoedWhy", lang)
    : a.capped
      ? t("verdict.cappedWhy", lang, { earned: t(`verdict.${a.earned.id}`, lang) })
      : t(`verdict.${a.verdict.id}.why`, lang);

  const capNote = $("#verdict-cap");
  capNote.hidden = !a.capped;
  capNote.textContent = a.capped ? t("verdict.capped", lang) : "";

  /* How close is it to changing its mind? A verdict presented
     without its own margin invites more confidence than it has
     earned. */
  /* The headroom line describes the SCORE's own band. Once the
     cap has overridden that band the line contradicts the verdict
     printed above it, "2.6 points lower → Hold" under a heading
     that already reads Hold, so it comes off. */
  const hr = $("#verdict-headroom");
  if (a.vetoed || a.capped || a.score === null
      || (a.edges.up === null && a.edges.down === null)) {
    hr.textContent = "";
    hr.hidden = true;
  } else {
    hr.hidden = false;
    const upBand = a.edges.up === null ? null : t(`verdict.${bandIdAt(a.edges.up)}`, lang);
    const downBand = a.edges.down === null ? null : t(`verdict.${bandIdBelow(a.edges.down)}`, lang);
    const bits = [];
    if (a.edges.down !== null) {
      bits.push(`${fmtNum(a.score - a.edges.down, lang, 1)} ${lang === "bn" ? "পয়েন্ট কমলে" : "points lower"} → ${downBand}`);
    }
    if (a.edges.up !== null && upBand) {
      bits.push(`${fmtNum(a.edges.up - a.score, lang, 1)} ${lang === "bn" ? "পয়েন্ট বাড়লে" : "points higher"} → ${upBand}`);
    }
    hr.textContent = bits.join("  ·  ");
  }

  /* The buy-below price: the median fair value discounted by the
     margin of safety a value buyer would want. Blank rather than
     invented when nothing could be valued. */
  const bb = $("#verdict-buybelow");
  if (Number.isFinite(a.fair.mid)) {
    bb.textContent = fmtTk(a.fair.mid * 0.75, lang);
  } else {
    bb.textContent = t("verdict.noBuyBelow", lang);
  }
}

const bandIdAt = (min) =>
  ({ 75: "buy", 62: "accumulate", 48: "hold", 35: "trim" }[min] ?? "avoid");
const bandIdBelow = (min) =>
  ({ 75: "accumulate", 62: "hold", 48: "trim", 35: "avoid" }[min] ?? "avoid");

function renderTiles(a) {
  const { d, r } = a;
  const tiles = [];
  const tile = (key, value, note, tone) => tiles.push(
    `<div class="tile"${tone ? ` data-tone="${tone}"` : ""}>
       <span class="mono">${esc(t(key, lang))}</span>
       <span class="tile-value">${value}</span>
       <small>${note}</small>
     </div>`);

  tile("t.pe", r.eps > 0 ? `${fmtNum(r.pe, lang, 1)}×` : "–",
    r.eps > 0 ? esc(t("t.vsSector", lang, { v: `${fmtNum(d.sectorPE, lang, 1)}×` }))
      : esc(lang === "bn" ? "মুনাফা নেই" : "no profit to divide by"),
    r.eps > 0 ? grade(bandOf("peRel", a)) : "na");

  tile("t.pb", Number.isFinite(r.pb) ? `${fmtNum(r.pb, lang, 2)}×` : "–",
    esc(t("t.vsSector", lang, { v: `${fmtNum(d.sectorPB, lang, 2)}×` })),
    grade(bandOf("pbRel", a)));

  tile("t.roe", Number.isFinite(r.roe) ? `${fmtNum(r.roe, lang, 1)}%` : "–",
    esc(t("t.vsSector", lang, { v: `${fmtNum(d.sectorROE, lang, 1)}%` })),
    grade(bandOf("roe", a)));

  tile("t.divYield", `${fmtNum(r.divYield, lang, 2)}%`,
    esc(t("t.vsRiskFree", lang, { v: `${fmtNum(d.riskFree, lang, 2)}%` })),
    grade(bandOf("yieldSpread", a)));

  tile("t.eps", fmtTk(r.eps, lang), esc(lang === "bn" ? "শেয়ারপ্রতি" : "per share"));
  tile("t.mcap", fmtLakh(r.mcap, lang), esc(lang === "bn" ? "বাজারমূল্য" : "market value"));

  if (r.isFinancial) {
    tile("m.npl", d.npl > 0 ? `${fmtNum(d.npl, lang, 1)}%` : "–",
      esc(lang === "bn" ? "খেলাপি ঋণ" : "of the loan book"), grade(bandOf("npl", a)));
    tile("m.car", d.car > 0 ? `${fmtNum(d.car, lang, 1)}%` : "–",
      esc(lang === "bn" ? "মূলধন পর্যাপ্ততা" : "capital adequacy"), grade(bandOf("car", a)));
  } else {
    tile("t.netDebt", Number.isFinite(r.netDebtEbitda) ? `${fmtNum(r.netDebtEbitda, lang, 2)}×` : "–",
      esc(lang === "bn" ? "নিট ঋণ শোধে কত বছর" : "years of cash profit"),
      grade(bandOf("netDebtEbitda", a)));
    tile("t.altman", Number.isFinite(r.altmanZ) ? fmtNum(r.altmanZ, lang, 2) : "–",
      esc(lang === "bn" ? "৫.৮৫ এর ওপরে নিরাপদ" : "above 5.85 is safe"),
      grade(bandOf("altmanZ", a)));
  }

  tile("t.fScore", r.fTested >= 5 ? fmtInt(r.fScore, lang) : "–",
    esc(t("t.ofTested", lang, { v: fmtInt(r.fTested, lang) })), grade(bandOf("fScore", a)));

  tile("t.mos", Number.isFinite(a.fair.marginOfSafety)
      ? `${fmtNum(a.fair.marginOfSafety, lang, 0)}%` : "–",
    esc(lang === "bn" ? "মধ্যক অনুমানের তুলনায়" : "against the median anchor"),
    !Number.isFinite(a.fair.marginOfSafety) ? "na"
      : a.fair.marginOfSafety > 25 ? "strong"
      : a.fair.marginOfSafety > 0 ? "fair" : "poor");

  $("#tiles").innerHTML = tiles.join("");
}

const bandOf = (id, a) => {
  const hit = a.scored.find((s) => s.id === id);
  return hit && !hit.na ? hit.score : null;
};

function renderPillars(a) {
  const host = $("#pillars");
  const openNow = new Set($$("details[data-pillar]", host).filter((x) => x.open)
    .map((x) => x.dataset.pillar));
  const out = [];

  /* How many points of the final score each pillar actually
     supplies. This is the number the weight sliders move, and
     without it they looked broken: a pillar's own score measures
     the COMPANY and cannot change when you change your mind about
     what matters, so six sliders labelled with the six pillar
     names appeared to do nothing to the six pillar numbers. The
     contributions sum to the score on the dial. */
  const wsum = PILLARS.reduce((sum, k) =>
    sum + (a.pillars[k].score !== null && weights[k] > 0 ? weights[k] : 0), 0);
  const contribution = (k) =>
    a.pillars[k].score === null || !(weights[k] > 0) || wsum === 0
      ? null
      : (a.pillars[k].score * weights[k]) / wsum;

  for (const p of PILLARS) {
    const ps = a.pillars[p];
    const g = grade(ps.score);
    const metrics = a.scored.filter((s) => s.pillar === p);
    const gives = contribution(p);

    const rows = metrics.map((s) => {
      const m = METRICS.find((x) => x.id === s.id);
      if (s.na) {
        return `<div class="metric is-na">
          <div class="metric-head">
            <span class="metric-name">${esc(t(`m.${s.id}`, lang))}</span>
            <span class="metric-value">${esc(t("na.reason", lang))}</span>
          </div>
        </div>`;
      }
      return `<div class="metric">
        <div class="metric-head">
          <span class="metric-name">${esc(t(`m.${s.id}`, lang))}</span>
          <span class="metric-value">${fmtValue(s.raw, s.fmt, lang)}
            <b data-grade="${s.grade}">${esc(t(`grade.${s.grade}`, lang))}</b></span>
        </div>
        ${bar(s.score, s.grade)}
        <p class="metric-why">${esc(t(`m.${s.id}.why`, lang))}</p>
      </div>`;
    }).join("");

    out.push(`<details class="pillar" data-pillar="${p}"${openNow.has(p) ? " open" : ""}${
      gives === null ? ' data-muted=""' : ""}>
      <summary>
        <span class="pillar-name">${esc(t(`pillar.${p}`, lang))}</span>
        <span class="pillar-weight mono">${gives === null
          ? esc(t("pillar.notCounted", lang))
          : `${fmtInt(weights[p], lang)}% · ${esc(t("pillar.gives", lang,
              { v: fmtNum(gives, lang, 1) }))}`}</span>
        <span class="pillar-score" data-grade="${g}">${ps.score === null ? "–" : fmtInt(ps.score, lang)}</span>
        ${bar(ps.score, g)}
      </summary>
      <p class="pillar-why">${esc(t(`pillar.${p}.why`, lang))}</p>
      <div class="metrics">${rows}</div>
    </details>`);
  }
  const total = PILLARS.reduce((sum, k) => sum + (contribution(k) ?? 0), 0);
  out.push(`<p class="pillar-total mono">${esc(t("pillar.total", lang, {
    v: fmtNum(total, lang, 1),
  }))}</p>`);

  host.innerHTML = out.join("");
}

function renderMarket(a) {
  $("#chart-range").innerHTML = rangeChart(a.d, a.r);
  $("#chart-yields").innerHTML = yieldChart(a.d, a.r);
}

function renderFair(a) {
  $("#chart-fair").innerHTML = fairChart(a.fair, a.d.price);
  const note = $("#fair-note");
  if (!Number.isFinite(a.fair.mid)) {
    note.textContent = t("fv.none", lang);
  } else if (a.fair.spread > 3) {
    note.textContent = t("fv.wide", lang);
  } else if (a.fair.marginOfSafety < 0) {
    note.textContent = t("fv.mosOver", lang);
  } else {
    note.textContent = "";
  }
  note.hidden = !note.textContent;

  const rows = a.fair.anchors.map((x) => `<tr>
    <th>${esc(t(`fv.${x.id}`, lang))}</th>
    <td>${fmtTk(x.value, lang)}</td>
    <td class="${x.value > a.d.price ? "is-positive" : "is-negative"}">
      ${fmtNum(((x.value - a.d.price) / a.d.price) * 100, lang, 0)}%</td>
  </tr>`).join("");

  $("#fair-table").innerHTML = a.fair.anchors.length ? `
    <table class="fin-table">
      <thead><tr>
        <th>${esc(t("sec.fair", lang))}</th>
        <th>${esc(t("th.value", lang))}</th>
        <th>${esc(lang === "bn" ? "দামের তুলনায়" : "vs price")}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="is-total">
        <th>${esc(t("fv.median", lang))}</th>
        <td>${fmtTk(a.fair.mid, lang)}</td>
        <td>${Number.isFinite(a.fair.marginOfSafety) ? `${fmtNum(a.fair.marginOfSafety, lang, 0)}%` : "–"}</td>
      </tr></tfoot>
    </table>` : "";
}

function renderSignals(a) {
  const host = $("#signals");
  if (!a.signals.length) {
    host.innerHTML = `<p class="statement-note">${esc(lang === "bn"
      ? "কোনো নামকরা ধরন মেলেনি: সংখ্যাগুলো আলাদা আলাদা করেই পড়তে হবে।"
      : "No named pattern fired: read the ratios individually.")}</p>`;
    return;
  }
  host.innerHTML = a.signals.map((s) => `
    <article class="signal" data-tone="${s.tone}">
      <h3>${esc(t(`s.${s.id}`, lang))}</h3>
      <p>${esc(t(`s.${s.id}.why`, lang))}</p>
    </article>`).join("");
}

function renderFlags(a) {
  const host = $("#flags");
  if (!a.flags.length) {
    host.innerHTML = `<p class="statement-note">${esc(lang === "bn"
      ? "কোনো সতর্কতা নেই: তবে এই টুল যা দেখতে পায় না, সেটা মনে রাখবেন।"
      : "Nothing flagged, which is not the same as nothing wrong. See the note at the foot of the page.")}</p>`;
    return;
  }
  const order = { veto: 0, bad: 1, warn: 2, info: 3 };
  const sorted = [...a.flags].sort((x, y) => order[x.level] - order[y.level]);
  host.innerHTML = sorted.map((f) => `
    <div class="flag" data-level="${f.level}">
      <span class="flag-mark" aria-hidden="true"></span>
      <p>${esc(t(`f.${f.id}`, lang))}</p>
    </div>`).join("");
}

function renderDupont(a) {
  $("#chart-dupont").innerHTML = dupontChart(a.r);
}

function renderPiotroski(a) {
  const host = $("#piotroski");
  const { r } = a;
  host.innerHTML = `
    <p class="fscore-head">
      <b>${r.fTested >= 5 ? `${fmtInt(r.fScore, lang)} / ${fmtInt(r.fTested, lang)}` : "–"}</b>
      <span>${esc(t("t.ofTested", lang, { v: fmtInt(r.fTested, lang) }))}</span>
    </p>
    <ul class="checks">${r.fChecks.map((c) => `
      <li data-state="${!c.testable ? "skip" : c.pass ? "pass" : "fail"}">
        <span class="check-box" aria-hidden="true"></span>
        <span>${esc(t(`p.${c.id}`, lang))}${!c.testable
          ? ` <em>${esc(t("p.skipped", lang))}</em>` : ""}</span>
      </li>`).join("")}</ul>`;
}

function renderDrags(a) {
  const host = $("#drags");
  if (!a.drags.length) { host.innerHTML = ""; return; }
  const max = a.drags[0].cost || 1;
  host.innerHTML = a.drags.map((x) => `
    <div class="drag-row">
      <span class="drag-name">${esc(t(`m.${x.id}`, lang))}
        <small>${esc(t(`pillar.${x.pillar}`, lang))}</small></span>
      <span class="drag-track"><i style="width:${((x.cost / max) * 100).toFixed(1)}%"></i></span>
      <span class="drag-cost">−${fmtNum(x.cost, lang, 1)}</span>
    </div>`).join("");
}

function renderScorecard(a) {
  const shares = new Map();
  {
    /* Each metric's share of the final score. Same decomposition
       drags() uses, and it sums to 100% across the live rows,
       which is the claim the table is making by printing it. */
    const wsum = PILLARS.reduce((s, p) =>
      s + (a.pillars[p]?.score !== null && weights[p] > 0 ? weights[p] : 0), 0);
    for (const p of PILLARS) {
      if (a.pillars[p]?.score === null || !(weights[p] > 0) || wsum === 0) continue;
      const live = a.scored.filter((s) => s.pillar === p && !s.na);
      const inner = live.reduce((s, x) => s + x.w, 0);
      for (const s of live) shares.set(s.id, (weights[p] / wsum) * (s.w / inner));
    }
  }

  const rows = a.scored.map((s) => `<tr${s.na ? ' class="is-na"' : ""}>
    <th>${esc(t(`m.${s.id}`, lang))}</th>
    <td>${esc(t(`pillar.${s.pillar}`, lang))}</td>
    <td>${s.na ? "–" : fmtValue(s.raw, s.fmt, lang)}</td>
    <td>${s.na ? esc(t("na.reason", lang)) : fmtInt(s.score, lang)}</td>
    <td>${shares.has(s.id) ? `${fmtNum(shares.get(s.id) * 100, lang, 1)}%` : "–"}</td>
  </tr>`).join("");

  $("#scorecard").innerHTML = `
    <table class="fin-table scorecard">
      <thead><tr>
        <th>${esc(t("th.metric", lang))}</th>
        <th>${esc(t("th.pillar", lang))}</th>
        <th>${esc(t("th.value", lang))}</th>
        <th>${esc(t("th.score", lang))}</th>
        <th>${esc(t("th.weight", lang))}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderShariah(a) {
  const s = a.shariah;
  $("#shariah").innerHTML = `
    <div class="shariah-verdict" data-pass="${s.pass}">
      ${esc(t(s.pass ? "sh.pass" : "sh.fail", lang))}
    </div>
    <ul class="checks">${s.tests.map((x) => `
      <li data-state="${x.pass ? "pass" : "fail"}">
        <span class="check-box" aria-hidden="true"></span>
        <span>${esc(t(`sh.${x.id}`, lang))}
          <em>${fmtNum(x.value, lang, 1)}%</em></span>
      </li>`).join("")}</ul>
    <p class="statement-note">${esc(t("sh.caveat", lang))}</p>`;
}

/* ============================================================
   ACTIONS
   ============================================================ */

function commit() { render(); }

function loadPreset(id) {
  state = { ...presetInput(id) };
  buildInputs();
  render();
}

function toCsv() {
  const a = last;
  const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
  const lines = [];
  lines.push("STOCK CHECK: reiad.co.uk/tools/stock");
  lines.push(q(t("disc.body", "en")));
  lines.push(q(t("disc.units", "en")));
  lines.push("");
  lines.push("VERDICT");
  lines.push(`Score,${a.score === null ? "" : a.score.toFixed(1)}`);
  lines.push(`Band,${q(t(a.vetoed ? "verdict.vetoed" : `verdict.${a.verdict.id}`, "en"))}`);
  lines.push(`Investor style,${style}`);
  lines.push(`Weights,${PILLARS.map((p) => `${p}=${weights[p]}`).join(" ")}`);
  lines.push("");
  lines.push("INPUTS");
  for (const [k, v] of Object.entries(state)) lines.push(`${k},${v}`);
  lines.push("");
  lines.push("PILLARS");
  for (const p of PILLARS) {
    lines.push(`${q(t(`pillar.${p}`, "en"))},${a.pillars[p].score === null ? "" : a.pillars[p].score.toFixed(1)},${weights[p]}`);
  }
  lines.push("");
  lines.push("SCORECARD");
  lines.push("Ratio,Pillar,Value,Score,Applies");
  for (const s of a.scored) {
    lines.push([q(t(`m.${s.id}`, "en")), s.pillar,
      s.na ? "" : (Number.isFinite(s.raw) ? s.raw.toFixed(4) : ""),
      s.na ? "" : s.score.toFixed(1), s.na ? "no" : "yes"].join(","));
  }
  lines.push("");
  lines.push("FAIR VALUE ANCHORS");
  for (const x of a.fair.anchors) lines.push(`${q(t(`fv.${x.id}`, "en"))},${x.value.toFixed(2)}`);
  lines.push(`Median,${Number.isFinite(a.fair.mid) ? a.fair.mid.toFixed(2) : ""}`);
  lines.push(`Margin of safety %,${Number.isFinite(a.fair.marginOfSafety) ? a.fair.marginOfSafety.toFixed(1) : ""}`);
  lines.push("");
  lines.push("FLAGS");
  for (const f of a.flags) lines.push(`${f.level},${q(t(`f.${f.id}`, "en"))}`);
  lines.push("");
  lines.push("PATTERNS");
  for (const s of a.signals) lines.push(`${s.tone},${q(t(`s.${s.id}`, "en"))}`);
  return lines.join("\n");
}

function download() {
  const blob = new Blob([toCsv()], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = el("a");
  a.href = url;
  a.download = "stock-check.csv";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ============================================================
   INIT
   ============================================================ */

/* ============================================================
   SAVED CHECKS

   The panel exists only for somebody signed in, and it is hidden
   in the markup rather than built here so that the layout it sits
   in is the layout the route rendered. `hidden` comes off once,
   after the account has answered.
   ============================================================ */

/** One line of the answer, stored beside the inputs so that the
    account page can list a saved check without loading a thousand
    lines of scoring model to find out what it concluded. */
function summarise() {
  if (!last) return "";
  const band = last.vetoed
    ? t("verdict.vetoed", "en")
    : t(`verdict.${last.verdict.id}`, "en");
  const score = last.score === null ? "no score" : last.score.toFixed(1);
  return `${score} · ${band}`;
}

function scenarioCard(row) {
  const query = typeof row.inputs?.query === "string" ? row.inputs.query : "";
  const card = el("div", "saved-row");

  const body = el("div", "saved-body");
  body.append(
    el("h3", null, esc(row.name || "Untitled")),
    el("p", "saved-line", esc(row.summary || "")),
  );

  const open = document.createElement("a");
  open.className = "btn btn-ghost btn-small";
  open.href = query ? `?${query.replace(/^\?/, "")}` : location.pathname;
  open.textContent = t("a.open", lang);

  const drop = document.createElement("button");
  drop.type = "button";
  drop.className = "btn btn-ghost btn-small";
  drop.textContent = t("a.remove", lang);
  drop.addEventListener("click", async () => {
    drop.disabled = true;
    try {
      await removeScenario(row.id);
      await paintSaved();
    } catch {
      drop.disabled = false;
    }
  });

  const actions = el("div", "saved-actions");
  actions.append(open, drop);
  card.append(body, actions);
  return card;
}

async function paintSaved() {
  const host = $("#scenario-list");
  if (!host) return;
  const rows = await listScenarios("stock");
  host.replaceChildren(...rows.map(scenarioCard));
}

/* Signing in and out on this page calls initSaved() again, and a
   second listener on the same button is a second row saved per
   press. The panel is wired once; showing it is the part that
   repeats. */
let savedWired = false;

function initSaved() {
  const panel = $("#save-scenario");
  if (!panel || !current()) return;

  panel.hidden = false;
  if (savedWired) { paintSaved(); return; }
  savedWired = true;

  const note = $("#scenario-note");
  const field = $("#scenario-name");

  $("#save-scenario-go").addEventListener("click", async (e) => {
    const name = field.value.trim() || [state.name, state.ticker].filter(Boolean)[0] || "";
    if (!name) { note.textContent = t("a.saveNamed", lang); return; }

    const button = e.currentTarget;
    button.disabled = true;
    try {
      /* The URL is written on every render, so what is in the
         address bar right now IS the state of this page. Reading
         it back rather than re-serialising `state` means there is
         one encoder and it is the one every shared link has been
         proving correct for a year. */
      writeUrl();
      await saveScenario({
        tool: "stock",
        name,
        inputs: { query: location.search.replace(/^\?/, "") },
        summary: summarise(),
      });
      note.textContent = t("a.saved", lang);
      field.value = "";
      await paintSaved();
    } catch (err) {
      note.textContent = err.message || t("a.saveFailed", lang);
    } finally {
      button.disabled = false;
    }
  });

  paintSaved();
}

function init() {
  // language: URL wins over the stored choice, both over English
  let stored = null;
  try { stored = localStorage.getItem("tool-lang"); } catch { /* private mode */ }
  if (stored === "bn" || stored === "en") lang = stored;
  Object.assign(state, readUrl());          // may override lang and weights

  $("#lang-switch").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-lang]");
    if (!b) return;
    langExplicit = true;
    applyLang(b.dataset.lang);
  });

  const presetRow = $("#preset-row");
  for (const p of PRESETS) {
    const b = el("button", "scenario");
    b.type = "button";
    b.dataset.preset = p.id;
    b.dataset.i18n = `preset.${p.id}`;
    b.textContent = t(`preset.${p.id}`, lang);
    presetRow.append(b);
  }
  presetRow.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-preset]");
    if (b) loadPreset(b.dataset.preset);
  });

  $("#download-csv").addEventListener("click", download);
  $("#reset").addEventListener("click", () => loadPreset("pharma"));
  $("#copy-link").addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText(location.href);
      const b = e.currentTarget;
      const was = b.textContent;
      b.textContent = t("a.copied", lang);
      setTimeout(() => { b.textContent = was; }, 1600);
    } catch { /* clipboard blocked: the URL is in the bar anyway */ }
  });
  $("#expand-all").addEventListener("click", (e) => {
    const b = e.currentTarget;
    const opening = b.dataset.mode !== "open";
    for (const d of $$("#pillars details")) d.open = opening;
    b.dataset.mode = opening ? "open" : "closed";
    b.textContent = t(opening ? "a.collapseAll" : "a.expandAll", lang);
  });

  /* ---- how much of the form to show ----

     `buildInputs()` reads `depth` and `applyLang` calls it, so
     switching is a rebuild of the panel and nothing else: no
     value is touched, so a reader who fills in Everything, drops
     to the main numbers and goes back finds what they typed
     exactly where they left it. */
  const depthSwitch = $("#depth-switch");
  if (depthSwitch) {
    depthSwitch.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-depth]");
      if (!b || b.dataset.depth === depth) return;
      depth = b.dataset.depth;
      paintDepth();
      buildInputs();
      render();
      /* Through `savePrefs`, so the account carries it and the
         settings panel and this switch cannot disagree. It is one
         dynamic import rather than a static one because this page
         must still work with no account and no network. */
      import("/prefs.js")
        .then((m) => m.savePrefs({ depth }))
        .catch(() => { /* the choice holds for this page */ });
    });
  }

  buildWeights();
  applyLang(lang, { save: false });          // builds the inputs and renders
  onSectorChange();
  render();

  /* Last, and after the first render, so the summary a save
     stores is the answer the reader is looking at. It reads the
     session out of this device and makes no request when nobody
     is signed in. */
  initSaved();
  document.addEventListener("account:changed", () => {
    const panel = $("#save-scenario");
    if (panel && !current()) { panel.hidden = true; return; }
    initSaved();
  });
}

init();
