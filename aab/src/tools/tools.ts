/* tools.ts: the five calculators. Every one writes its state into
   the URL, so a result is a link. Charts are inline SVG drawn
   here, inheriting the theme's colours.
   A chart draws `--series-1` and `--series-2`, never a colour by
   name: the first is the page's own accent and the second is
   neutral. `next/components/ui/legend.tsx` reads the same two, so
   the chart and its legend cannot drift. */

import { CALCULATORS, FORMATS } from "/calculators.js";
import { t, type Lang } from "/tools/stock.i18n.js";

/* `ParentNode` rather than `Document`, because every caller here
   passes a calculator's own <section> and the two do not share an
   interface any narrower. */
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  [...root.querySelectorAll<T>(sel)];

/* ---------- formatting ---------- */

const bdt = new Intl.NumberFormat("en-BD", {
  style: "currency", currency: "BDT", maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });
const dec = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 });
const pct = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 1 });

/** ৳12,34,567, but shortened once it stops being readable. */
function money(n: number): string {
  if (!Number.isFinite(n)) return "–";
  const abs = Math.abs(n);
  if (abs >= 1e7) return `৳${(n / 1e7).toFixed(2)} crore`;
  if (abs >= 1e5) return `৳${(n / 1e5).toFixed(2)} lakh`;
  return bdt.format(n).replace("BDT", "৳").replace(/\s/g, "");
}

/* ============================================================
   URL state, a calculation you can link to
   ============================================================ */

/** Every input's value, as the DOM gives them: a string, or a
    boolean for a checkbox. */
type Values = Record<string, string | boolean>;

function readState(toolId: string): Record<string, string> {
  const params = new URLSearchParams(location.search);
  const prefix = `${toolId}.`;
  const out: Record<string, string> = {};
  for (const [k, v] of params) if (k.startsWith(prefix)) out[k.slice(prefix.length)] = v;
  return out;
}

function writeState(toolId: string, values: Values) {
  const params = new URLSearchParams(location.search);
  for (const k of [...params.keys()]) if (k.startsWith(`${toolId}.`)) params.delete(k);
  Object.entries(values).forEach(([k, v]) => params.set(`${toolId}.${k}`, String(v)));
  history.replaceState(null, "", `?${params}${location.hash}`);
}

/* ============================================================
   Charts
   ============================================================ */

/** One line on an area chart: the numbers, and the token it is
    drawn in. `color` is a `var(--series-N)` string rather than a
    colour, which is the whole point of the two tokens. */
type Series = { values: number[]; color: string; fill?: number };

/** Stacked area: what you put in vs. what the growth added. */
function areaChart(
  series: Series[],
  { height = 190, labels = [] }: { height?: number; labels?: string[] } = {},
): string {
  const W = 620, H = height, PAD = { t: 12, r: 8, b: 26, l: 8 };
  const n = series[0].values.length;
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const x = (i: number) => PAD.l + (i / Math.max(1, n - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);

  const svg = [`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Growth over time" preserveAspectRatio="none">`];

  // horizontal guides
  for (let g = 0; g <= 3; g++) {
    const gy = PAD.t + (g / 3) * (H - PAD.t - PAD.b);
    svg.push(`<line x1="${PAD.l}" y1="${gy}" x2="${W - PAD.r}" y2="${gy}"
      stroke="var(--hairline)" stroke-width="1"/>`);
  }

  series.forEach((s) => {
    const line = s.values.map((v: number, i: number) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    svg.push(`<path d="${line} L${x(n - 1).toFixed(1)},${y(0)} L${x(0)},${y(0)} Z"
      fill="${s.color}" opacity="${s.fill ?? 0.16}"/>`);
    svg.push(`<path d="${line}" fill="none" stroke="${s.color}" stroke-width="2"
      stroke-linejoin="round" stroke-linecap="round"/>`);
  });

  labels.forEach((label: string, i: number) => {
    const at = Math.round((i / Math.max(1, labels.length - 1)) * (n - 1));
    svg.push(`<text x="${x(at).toFixed(1)}" y="${H - 6}" fill="var(--ink-soft)"
      font-family="IBM Plex Mono, monospace" font-size="11"
      text-anchor="${i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}">${label}</text>`);
  });

  svg.push("</svg>");
  return svg.join("");
}

/** One bar: the figure above it, the caption under it, and the
    token it is drawn in. */
type Bar = { label: string; caption: string; value: number; color: string };

/** Simple bar comparison. */
function barChart(bars: Bar[], { height = 150 }: { height?: number } = {}): string {
  const W = 620, H = height, PAD = 28;
  const max = Math.max(...bars.map((b) => b.value), 1);
  const bw = (W - PAD * 2) / bars.length;
  const svg = [`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Comparison" preserveAspectRatio="none">`];
  bars.forEach((b: Bar, i: number) => {
    const h = (b.value / max) * (H - 52);
    const x = PAD + i * bw + bw * 0.18;
    const w = bw * 0.64;
    svg.push(`<rect x="${x.toFixed(1)}" y="${(H - 30 - h).toFixed(1)}" width="${w.toFixed(1)}"
      height="${h.toFixed(1)}" rx="5" fill="${b.color}"/>`);
    svg.push(`<text x="${(x + w / 2).toFixed(1)}" y="${(H - 36 - h).toFixed(1)}"
      fill="var(--ink)" font-family="IBM Plex Mono, monospace" font-size="12"
      text-anchor="middle">${b.label}</text>`);
    svg.push(`<text x="${(x + w / 2).toFixed(1)}" y="${H - 10}"
      fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace" font-size="11"
      text-anchor="middle">${b.caption}</text>`);
  });
  svg.push("</svg>");
  return svg.join("");
}

/* ============================================================
   Wiring: bind inputs → recompute → render
   ============================================================ */

/** A control a calculator reads. `select` has no `checked` and
    `input` has no `options`, so what the two share is what this
    file uses: a name, a value and a type. */
type Control = HTMLInputElement | HTMLSelectElement;

/** What a calculator does with the values: write its figures and
    draw its chart into its own root. */
type Compute = (values: Values, root: HTMLElement) => void;

function bindTool(id: string, compute: Compute) {
  const root = document.getElementById(id);
  if (!root) return;

  const inputs = $$<Control>("input, select", root).filter((i) => i.name);
  const saved = readState(id);

  inputs.forEach((input) => {
    const was = saved[input.name];
    if (was !== undefined) input.value = was;
    input.addEventListener("input", run);
  });

  function values(): Values {
    return Object.fromEntries(
      inputs.map((i) => [
        i.name,
        i instanceof HTMLInputElement && i.type === "checkbox" ? i.checked : i.value,
      ]),
    );
  }

  function run() {
    const v = values();

    // fill the little live value next to each slider, and paint its track
    inputs.forEach((input) => {
      const out = root!.querySelector<HTMLElement>(`[data-for="${input.name}"]`);
      if (out) out.textContent = out.dataset.format === "money"
        ? money(Number(input.value))
        // rates carry decimals; years and counts happen not to
        : `${dec.format(Number(input.value))}${out.dataset.suffix ?? ""}`;
      if (input instanceof HTMLInputElement && input.type === "range") {
        const min = Number(input.min || 0), max = Number(input.max || 100);
        input.style.setProperty("--pct", `${((Number(input.value) - min) / (max - min)) * 100}%`);
      }
    });

    compute(v, root!);
    writeState(id, v);
  }

  const copy = $(".copy-link", root);
  copy?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(location.href).catch(() => {});
    const was = copy.textContent;
    copy.textContent = "Link copied";
    setTimeout(() => { copy.textContent = was; }, 1600);
  });

  run();
}

/** Write one figure and the line under it.

    Every lookup is optional. A calculator's markup is a route's
    now, so a renamed `data-stat` should leave the rest of the
    page working rather than throwing on the first one and taking
    the chart with it. */
const setStat = (root: HTMLElement, key: string, value: string, note?: string) => {
  const stat = root.querySelector(`[data-stat="${key}"]`);
  if (!stat) return;
  const v = stat.querySelector(".v");
  if (v) v.textContent = value;
  if (note !== undefined) {
    const n = stat.querySelector(".n");
    if (n) n.textContent = note;
  }
};

/** The element a calculator writes into, or somewhere harmless.

    Ten call sites assign `innerHTML` to `.chart-box` and
    `.verdict`. The markup is a Next route's now, so a renamed
    class should cost one chart rather than throwing partway
    through and leaving the figures above it stale. */
const slot = (root: HTMLElement, sel: string): HTMLElement =>
  $(sel, root) ?? document.createElement("div");

/* ============================================================
   THE FIVE, over one model

   Every calculator here used to hold its own arithmetic AND its
   own sentences, inline, in the function that drew them. The
   arithmetic is `shared/calculators.ts` now and the sentences are
   `shared/tool-strings.ts`, for the reason `shared/` exists at
   all: the Android app has a Kotlin port of the first, and a
   second copy of the second would have parted company with this
   one at the first edit.

   So what is left here is the DRAWING, which is what this file
   was always for. A calculator hands back numbers by name and the
   key of a sentence; this fills the figures, the notes, the chart
   and the verdict from them.

   **And the words follow `tool-lang`.** These five were English
   only, not by decision but because their sentences were template
   literals: translating one meant editing code. They are in the
   table now, in both languages, like the stock check next door.
   ============================================================ */

/** A named number, printed the way `FORMATS` says. One place, so
    `{growth}` inside a Bangla sentence and the figure above it
    cannot disagree about whether it is money. */
function show(name: string, value: number): string {
  switch (FORMATS[name]) {
    case "money": return money(value);
    case "percent": return `${pct.format(value)}%`;
    case "price": return money(value);
    case "years": return num.format(value);
    default: return Number.isFinite(value) ? dec.format(value) : "\u2013";
  }
}

/** A sentence with its numbers in it. */
const say = (key: string, values: Values2): string =>
  t(key, lang, Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, show(k, v)]),
  ));

type Values2 = Record<string, number>;

/** Which language the calculators are in.

    `tool-lang`, which the stock check has written since long
    before there were accounts and which `reader-prefs` carries
    between a reader's devices. One choice, one key: choosing
    Bangla on the stock check chooses it here too. */
let lang: Lang = "en";
try {
  const saved = localStorage.getItem("tool-lang");
  if (saved === "bn" || saved === "en") lang = saved;
} catch { /* private mode */ }

/** Fill every label the markup marked as translatable.

    The route ships English in the tag, so a reader with no
    JavaScript sees a working page rather than empty labels, and
    this replaces it where the reader has asked for Bangla. */
function applyLang(root: ParentNode = document): void {
  for (const node of $$<HTMLElement>("[data-i18n]", root)) {
    const key = node.dataset.i18n;
    if (key) node.textContent = t(key, lang);
  }
}

/** The three x labels under a chart. Not phrases: two of the
    three are a number with one word in front of them, and a key
    per year would be four hundred keys. */
const chartLabels = (years: number): string[] => [
  t("calc.chart.now", lang),
  t("calc.chart.year", lang, { n: num.format(Math.round(years / 2)) }),
  t("calc.chart.year", lang, { n: num.format(years) }),
];

/* `bindTool` runs its compute SYNCHRONOUSLY, at the end of
   binding, so everything the compute reaches has to be declared
   above this loop. `chartLabels` was below it for one commit: an
   arrow function in a `const` is in the temporal dead zone until
   its line runs, so the first calculator threw at its chart, the
   loop unwound, and the other four were never bound at all.

   Every figure ABOVE the chart line had already been written, so
   the page showed a filled-in compounding calculator and four
   empty ones, and the one assertion watching this page read the
   first of those figures. `next/interactive.test.ts` reads all
   five now, and the verdict under each. */
for (const calc of CALCULATORS) {
  bindTool(calc.id, (v, root) => {
    const nums: Values2 = Object.fromEntries(
      calc.fields.map((f) => [f.name, Number(v[f.name])]),
    );
    const out = calc.run(nums);

    calc.figures.forEach((key) => {
      const note = out.notes[key];
      setStat(root, key, show(key, out.values[key]), note ? say(note, out.values) : "");
    });

    if (calc.lines.length === 2) {
      slot(root, ".chart-box").innerHTML = areaChart([
        { values: out.series[calc.lines[0]], color: "var(--series-1)", fill: 0.18 },
        { values: out.series[calc.lines[1]], color: "var(--series-2)", fill: 0.12 },
      ], { labels: chartLabels(out.values.years) });
    } else if (calc.id === "sanchayapatra") {
      /* Two totals rather than a line: nothing about either
         option changes shape over the years, so a chart of them
         would be two straight lines saying what two bars say. */
      slot(root, ".chart-box").innerHTML = barChart([
        { label: money(out.values.sTotal), caption: "\u09b8\u099e\u09cd\u099a\u09df\u09aa\u09a4\u09cd\u09b0",
          value: out.values.sTotal, color: "var(--series-1)" },
        { label: money(out.values.fTotal), caption: "FDR",
          value: out.values.fTotal, color: "var(--series-2)" },
      ]);
      fillSides(root, out.values);
    }

    slot(root, ".verdict").textContent = say(`calc.${calc.id}.${out.verdict}`, out.values);
  });
}

/** The sanchayapatra comparison's two boxes, which show the
    working rather than only the answer: gross, the tax taken off
    it, what is left, and the total with the principal back. */
function fillSides(root: HTMLElement, v: Values2): void {
  const sWins = v.sTotal >= v.fTotal;
  const side = (which: string, wins: boolean): HTMLElement => {
    const box = slot(root, `[data-side="${which}"]`);
    box.classList.toggle("winner", wins);
    return box;
  };
  const fill = (box: HTMLElement, gross: number, tax: number, net: number, total: number) => {
    const put = (k: string, text: string) => {
      const cell = box.querySelector(`[data-k=${k}]`);
      if (cell) cell.textContent = text;
    };
    put("gross", money(gross));
    put("tax", `\u2212 ${money(tax)}`);
    put("net", money(net));
    put("total", money(total));
  };
  fill(side("s", sWins), v.sGross, v.sPaidTax, v.sNet, v.sTotal);
  fill(side("f", !sWins), v.fGross, v.fPaidTax, v.fNet, v.fTotal);
}

applyLang();


/* ============================================================
   ONE CALCULATOR AT A TIME

   Five stacked calculators meant that whichever one you came for,
   you scrolled past the others to reach it, and the page never
   looked like a tool: it looked like a list. So the picker in the
   hero becomes a real tab set and only the chosen calculator is
   shown, starting with the first.

   Everything here is an upgrade applied at runtime. The markup
   ships as five ordinary <section>s and five ordinary anchor
   links, so with JavaScript off the page behaves exactly as it
   did before: all five present, links jumping to them. Nothing is
   hidden by CSS alone: the hiding only happens once this code
   has run and can undo it.
   ============================================================ */
(function tabs() {
  const bar = document.getElementById("tool-tabs");
  const panels = $$(".tool");
  if (!bar || panels.length === 0) return;

  const links = $$<HTMLAnchorElement>(".tab", bar);
  const idOf = (a: Element) => a.getAttribute("href")?.slice(1) ?? "";

  // Only now does hiding become safe.
  document.body.dataset.toolTabs = "on";
  panels.forEach((p) => {
    p.setAttribute("role", "tabpanel");
    p.setAttribute("aria-labelledby", `tab-${p.id}`);
  });

  function show(id: string, { focus = false, push = false } = {}) {
    const panel = panels.find((p) => p.id === id) ?? panels[0];
    panels.forEach((p) => { p.hidden = p !== panel; });
    links.forEach((a) => {
      const on = idOf(a) === panel.id;
      a.setAttribute("aria-selected", String(on));
      // roving tabindex: one stop for the whole set, arrows move within
      a.tabIndex = on ? 0 : -1;
      if (on && focus) a.focus();
    });

    if (push && location.hash.slice(1) !== panel.id) {
      // replaceState, not a hash assignment: setting location.hash would
      // scroll the panel under the sticky header on every tab change.
      history.replaceState(null, "", `${location.pathname}${location.search}#${panel.id}`);
    }
    return panel.id;
  }

  bar.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest(".tab");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    show(idOf(a), { push: true });
  });

  bar.addEventListener("keydown", (e) => {
    const i = links.findIndex((a) => a.getAttribute("aria-selected") === "true");
    const last = links.length - 1;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i >= last ? 0 : i + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i <= 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    show(idOf(links[to]), { focus: true, push: true });
  });

  // A link from the menu or the palette (/tools/index.html#emi) picks
  // that tab rather than scrolling to it.
  addEventListener("hashchange", () => show(location.hash.slice(1)));

  show(location.hash.slice(1) || panels[0].id);
})();
