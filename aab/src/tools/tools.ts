/* ============================================================
   tools.ts: the calculators.

   Five of them, all live: change an input and the numbers and
   the chart move with it. Every calculator writes its state
   into the URL, so a result is a link you can send someone.

   Charts are inline SVG drawn here: no library, no canvas, and
   they inherit the theme's colours so dark mode just works.

   The maths is deliberately transparent and every calculator
   says what it assumes. Rates in Bangladesh change; the numbers
   here are inputs, not promises.

   ---- the two series, and why they are not colours ----

   A chart here draws with `--series-1` and `--series-2`, which
   the stylesheet derives: the first is the page's own accent and
   the second is neutral. It used to draw `--green` and `--gold`
   by name, so every calculator on the gold tools page drew itself
   in Insights' green, and the legend beside it did too. The
   legend is `next/components/ui/legend.tsx` and it reads the same
   two tokens, so the two halves cannot drift.
   ============================================================ */

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
   1 · COMPOUNDING, what a monthly habit becomes
   ============================================================ */
bindTool("compounding", (v, root) => {
  const start = Number(v.start) || 0;
  const monthly = Number(v.monthly) || 0;
  const rate = Number(v.rate) / 100;
  const years = Number(v.years) || 1;

  const r = rate / 12;
  const contributed = [];
  const totals = [];
  let balance = start;
  let paidIn = start;

  for (let m = 0; m <= years * 12; m++) {
    if (m > 0) {
      balance = balance * (1 + r) + monthly;
      paidIn += monthly;
    }
    if (m % 12 === 0) { totals.push(balance); contributed.push(paidIn); }
  }

  const final = balance;
  const growth = final - paidIn;

  setStat(root, "final", money(final), `after ${years} year${years === 1 ? "" : "s"}`);
  setStat(root, "paid", money(paidIn), "your own money");
  setStat(root, "growth", money(growth),
    paidIn > 0 ? `${pct.format((growth / paidIn) * 100)}% on top` : "");

  slot(root, ".chart-box").innerHTML = areaChart(
    [
      { values: totals, color: "var(--series-1)", fill: 0.18 },
      { values: contributed, color: "var(--series-2)", fill: 0.12 },
    ],
    { labels: ["now", `year ${Math.round(years / 2)}`, `year ${years}`] }
  );

  const doubles = rate > 0 ? 72 / (rate * 100) : Infinity;
  slot(root, ".verdict").innerHTML = Number.isFinite(doubles)
    ? `At <b>${pct.format(rate * 100)}%</b>, money roughly doubles every
       <b>${pct.format(doubles)} years</b> (the rule of 72). Of your
       ${money(final)}, <b>${money(growth)}</b> is growth you didn't have to earn,
       and the longer half of that arrives in the final third of the time.`
    : "Set a rate above zero to see compounding do anything.";
});

/* ============================================================
   2 · SANCHAYAPATRA vs FDR
   ============================================================ */
bindTool("sanchayapatra", (v, root) => {
  const amount = Number(v.amount) || 0;
  const years = Number(v.years) || 1;
  const sRate = Number(v.srate) / 100;
  const fRate = Number(v.frate) / 100;
  const sTax = Number(v.stax) / 100;
  const fTax = Number(v.ftax) / 100;

  // Sanchayapatra: profit paid out (typically quarterly), taxed at source.
  const sGross = amount * sRate * years;
  const sNet = sGross * (1 - sTax);

  // FDR: interest compounds, and tax is deducted from the interest.
  const fGross = amount * ((1 + fRate) ** years - 1);
  const fNet = fGross * (1 - fTax);

  const sTotal = amount + sNet;
  const fTotal = amount + fNet;
  const gap = Math.abs(sTotal - fTotal);
  const sWins = sTotal >= fTotal;

  const side = (which: string, wins: boolean): HTMLElement => {
    const box = slot(root, `[data-side="${which}"]`);
    box.classList.toggle("winner", wins);
    return box;
  };
  const fill = (box: HTMLElement, gross: number, net: number, total: number) => {
    const put = (k: string, text: string) => {
      const cell = box.querySelector(`[data-k=${k}]`);
      if (cell) cell.textContent = text;
    };
    put("gross", money(gross));
    put("tax", `− ${money(gross - net)}`);
    put("net", money(net));
    put("total", money(total));
  };

  fill(side("s", sWins), sGross, sNet, sTotal);
  fill(side("f", !sWins), fGross, fNet, fTotal);

  slot(root, ".chart-box").innerHTML = barChart([
    { label: money(sTotal), caption: "সঞ্চয়পত্র", value: sTotal, color: "var(--series-1)" },
    { label: money(fTotal), caption: "FDR", value: fTotal, color: "var(--series-2)" },
  ]);

  slot(root, ".verdict").innerHTML = gap < amount * 0.005
    ? `Over ${years} years these land within ${money(gap)} of each other, close
       enough that the <b>rules</b> matter more than the rate: the purchase
       ceiling on sanchayapatra, and how quickly you can get the money out.`
    : `<b>${sWins ? "সঞ্চয়পত্র" : "FDR"}</b> comes out ahead by
       <b>${money(gap)}</b> over ${years} years, about
       ${pct.format((gap / amount) * 100)}% of what you put in. Worth checking
       the early-encashment penalty before you decide, since that's where the
       difference usually goes.`;
});

/* ============================================================
   3 · INFLATION, what money is really worth later
   ============================================================ */
bindTool("inflation", (v, root) => {
  const amount = Number(v.amount) || 0;
  const inflation = Number(v.inflation) / 100;
  const years = Number(v.years) || 1;
  const nominal = Number(v.nominal) / 100;

  const worth = amount / (1 + inflation) ** years;
  const lost = amount - worth;
  // Fisher, done properly rather than by subtraction
  const real = (1 + nominal) / (1 + inflation) - 1;
  const grown = amount * (1 + nominal) ** years;
  const grownReal = grown / (1 + inflation) ** years;

  setStat(root, "worth", money(worth), `today's taka, in ${years} years`);
  setStat(root, "lost", money(lost), `${pct.format((lost / amount) * 100)}% of its power gone`);
  setStat(root, "real", `${pct.format(real * 100)}%`,
    real >= 0 ? "real return, after inflation" : "you are losing ground");

  const nominalSeries = [], realSeries = [];
  for (let y = 0; y <= years; y++) {
    nominalSeries.push(amount * (1 + nominal) ** y);
    realSeries.push((amount * (1 + nominal) ** y) / (1 + inflation) ** y);
  }
  slot(root, ".chart-box").innerHTML = areaChart(
    [
      { values: nominalSeries, color: "var(--series-2)", fill: 0.12 },
      { values: realSeries, color: "var(--series-1)", fill: 0.18 },
    ],
    { labels: ["now", `year ${Math.round(years / 2)}`, `year ${years}`] }
  );

  slot(root, ".verdict").innerHTML = real >= 0
    ? `A ${pct.format(nominal * 100)}% return against ${pct.format(inflation * 100)}%
       inflation is really <b>${pct.format(real * 100)}%</b>. Your ${money(amount)}
       becomes ${money(grown)} on paper, but only <b>${money(grownReal)}</b> in
       what it can actually buy.`
    : `A ${pct.format(nominal * 100)}% return does not keep up with
       ${pct.format(inflation * 100)}% inflation. On paper you'd have
       ${money(grown)}; in real buying power that is <b>${money(grownReal)}</b>:
       less than the ${money(amount)} you started with. This is the quiet way
       "safe" savings lose money.`;
});

/* ============================================================
   4 · EMI
   ============================================================ */
bindTool("emi", (v, root) => {
  const principal = Number(v.principal) || 0;
  const rate = Number(v.rate) / 100 / 12;
  const months = (Number(v.years) || 1) * 12;

  const emi = rate > 0
    ? (principal * rate * (1 + rate) ** months) / ((1 + rate) ** months - 1)
    : principal / months;
  const total = emi * months;
  const interest = total - principal;

  setStat(root, "emi", money(emi), "every month");
  setStat(root, "interest", money(interest),
    principal > 0 ? `${pct.format((interest / principal) * 100)}% of what you borrowed` : "");
  setStat(root, "total", money(total), `over ${Number(v.years)} years`);

  // how the balance falls, and how much of it is interest
  const balances = [], paid = [];
  let bal = principal, cumInterest = 0;
  for (let m = 0; m <= months; m++) {
    if (m > 0) {
      const i = bal * rate;
      cumInterest += i;
      bal = Math.max(0, bal - (emi - i));
    }
    if (m % 12 === 0 || m === months) { balances.push(bal); paid.push(cumInterest); }
  }
  slot(root, ".chart-box").innerHTML = areaChart(
    [
      { values: balances, color: "var(--series-1)", fill: 0.16 },
      { values: paid, color: "var(--danger)", fill: 0.12 },
    ],
    { labels: ["start", "", "end"] }
  );

  const shorter = Math.max(1, Number(v.years) - 2);
  const rate2 = rate;
  const m2 = shorter * 12;
  const emi2 = rate2 > 0
    ? (principal * rate2 * (1 + rate2) ** m2) / ((1 + rate2) ** m2 - 1)
    : principal / m2;
  const saved = total - emi2 * m2;

  slot(root, ".verdict").innerHTML = saved > 0
    ? `Paying it off in <b>${shorter} years</b> instead of ${v.years} raises the
       instalment to ${money(emi2)} but saves <b>${money(saved)}</b> in interest.
       The length of a loan costs more than most people expect.`
    : `Interest adds <b>${money(interest)}</b> to what you borrowed.`;
});

/* ============================================================
   5 · POSITION SIZING
   ============================================================ */
bindTool("position", (v, root) => {
  const capital = Number(v.capital) || 0;
  const riskPct = Number(v.risk) / 100;
  const entry = Number(v.entry) || 0;
  const stop = Number(v.stop) || 0;

  const riskTaka = capital * riskPct;
  const perShare = Math.max(0, entry - stop);
  const shares = perShare > 0 ? Math.floor(riskTaka / perShare) : 0;
  const cost = shares * entry;
  const exposure = capital > 0 ? (cost / capital) * 100 : 0;

  setStat(root, "shares", shares ? num.format(shares) : "–", "shares");
  setStat(root, "cost", money(cost),
    cost > capital ? "more than your capital" : `${pct.format(exposure)}% of the portfolio`);
  setStat(root, "risk", money(riskTaka), "at risk if the stop is hit");

  const overweight = cost > capital;
  slot(root, ".verdict").innerHTML = perShare <= 0
    ? `Your stop needs to sit <b>below</b> your entry price; otherwise there's
       no defined loss to size against.`
    : overweight
      ? `A ${pct.format(riskPct * 100)}% risk rule with a stop that close would
         need <b>${money(cost)}</b> of stock, more than your whole
         ${money(capital)}. That's the signal: either the stop is too tight, or
         this trade doesn't fit the account.`
      : `Risking ${pct.format(riskPct * 100)}% of ${money(capital)} means
         <b>${num.format(shares)} shares</b> at ${money(entry)}, costing
         ${money(cost)}. If the stop at ${money(stop)} is hit you lose
         <b>${money(riskTaka)}</b>: a planned number, not a surprise. Twenty
         losses in a row at this size would still leave you
         ${money(capital * (1 - riskPct) ** 20)}.`;
});

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

  const links = $$<HTMLAnchorElement>(".tool-tab", bar);
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
    const a = (e.target as Element | null)?.closest(".tool-tab");
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
