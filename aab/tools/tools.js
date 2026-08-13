/* ============================================================
   tools.js: the calculators.

   Five of them, all live: change an input and the numbers and
   the chart move with it. Every calculator writes its state
   into the URL, so a result is a link you can send someone.

   Charts are inline SVG drawn here: no library, no canvas, and
   they inherit the theme's colours so dark mode just works.

   The maths is deliberately transparent and every calculator
   says what it assumes. Rates in Bangladesh change; the numbers
   here are inputs, not promises.
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- formatting ---------- */

const bdt = new Intl.NumberFormat("en-BD", {
  style: "currency", currency: "BDT", maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });
const dec = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 });
const pct = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 1 });

/** ৳12,34,567, but shortened once it stops being readable. */
function money(n) {
  if (!Number.isFinite(n)) return "–";
  const abs = Math.abs(n);
  if (abs >= 1e7) return `৳${(n / 1e7).toFixed(2)} crore`;
  if (abs >= 1e5) return `৳${(n / 1e5).toFixed(2)} lakh`;
  return bdt.format(n).replace("BDT", "৳").replace(/\s/g, "");
}

/* ============================================================
   URL state, a calculation you can link to
   ============================================================ */

function readState(toolId) {
  const params = new URLSearchParams(location.search);
  const prefix = `${toolId}.`;
  const out = {};
  for (const [k, v] of params) if (k.startsWith(prefix)) out[k.slice(prefix.length)] = v;
  return out;
}

function writeState(toolId, values) {
  const params = new URLSearchParams(location.search);
  for (const k of [...params.keys()]) if (k.startsWith(`${toolId}.`)) params.delete(k);
  Object.entries(values).forEach(([k, v]) => params.set(`${toolId}.${k}`, v));
  history.replaceState(null, "", `?${params}${location.hash}`);
}

/* ============================================================
   Charts
   ============================================================ */

/** Stacked area: what you put in vs. what the growth added. */
function areaChart(series, { height = 190, labels = [] } = {}) {
  const W = 620, H = height, PAD = { t: 12, r: 8, b: 26, l: 8 };
  const n = series[0].values.length;
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const x = (i) => PAD.l + (i / Math.max(1, n - 1)) * (W - PAD.l - PAD.r);
  const y = (v) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);

  const svg = [`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Growth over time" preserveAspectRatio="none">`];

  // horizontal guides
  for (let g = 0; g <= 3; g++) {
    const gy = PAD.t + (g / 3) * (H - PAD.t - PAD.b);
    svg.push(`<line x1="${PAD.l}" y1="${gy}" x2="${W - PAD.r}" y2="${gy}"
      stroke="var(--hairline)" stroke-width="1"/>`);
  }

  series.forEach((s) => {
    const line = s.values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    svg.push(`<path d="${line} L${x(n - 1).toFixed(1)},${y(0)} L${x(0)},${y(0)} Z"
      fill="${s.color}" opacity="${s.fill ?? 0.16}"/>`);
    svg.push(`<path d="${line}" fill="none" stroke="${s.color}" stroke-width="2"
      stroke-linejoin="round" stroke-linecap="round"/>`);
  });

  labels.forEach((label, i) => {
    const at = Math.round((i / Math.max(1, labels.length - 1)) * (n - 1));
    svg.push(`<text x="${x(at).toFixed(1)}" y="${H - 6}" fill="var(--ink-soft)"
      font-family="IBM Plex Mono, monospace" font-size="11"
      text-anchor="${i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}">${label}</text>`);
  });

  svg.push("</svg>");
  return svg.join("");
}

/** Simple bar comparison. */
function barChart(bars, { height = 150 } = {}) {
  const W = 620, H = height, PAD = 28;
  const max = Math.max(...bars.map((b) => b.value), 1);
  const bw = (W - PAD * 2) / bars.length;
  const svg = [`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Comparison" preserveAspectRatio="none">`];
  bars.forEach((b, i) => {
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

function bindTool(id, compute) {
  const root = document.getElementById(id);
  if (!root) return;

  const inputs = $$("input, select", root).filter((i) => i.name);
  const saved = readState(id);

  inputs.forEach((input) => {
    if (saved[input.name] !== undefined) input.value = saved[input.name];
    input.addEventListener("input", run);
  });

  function values() {
    return Object.fromEntries(
      inputs.map((i) => [i.name, i.type === "checkbox" ? i.checked : i.value])
    );
  }

  function run() {
    const v = values();

    // fill the little live value next to each slider, and paint its track
    inputs.forEach((input) => {
      const out = root.querySelector(`[data-for="${input.name}"]`);
      if (out) out.textContent = out.dataset.format === "money"
        ? money(Number(input.value))
        // rates carry decimals; years and counts happen not to
        : `${dec.format(Number(input.value))}${out.dataset.suffix ?? ""}`;
      if (input.type === "range") {
        const min = Number(input.min || 0), max = Number(input.max || 100);
        input.style.setProperty("--pct", `${((input.value - min) / (max - min)) * 100}%`);
      }
    });

    compute(v, root);
    writeState(id, v);
  }

  $(".copy-link", root)?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(location.href).catch(() => {});
    const b = $(".copy-link", root);
    const was = b.textContent;
    b.textContent = "Link copied";
    setTimeout(() => (b.textContent = was), 1600);
  });

  run();
}

const setStat = (root, key, value, note) => {
  const stat = root.querySelector(`[data-stat="${key}"]`);
  if (!stat) return;
  stat.querySelector(".v").textContent = value;
  if (note !== undefined) stat.querySelector(".n").textContent = note;
};

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

  $(".chart-box", root).innerHTML = areaChart(
    [
      { values: totals, color: "var(--green)", fill: 0.18 },
      { values: contributed, color: "var(--gold)", fill: 0.12 },
    ],
    { labels: ["now", `year ${Math.round(years / 2)}`, `year ${years}`] }
  );

  const doubles = rate > 0 ? 72 / (rate * 100) : Infinity;
  $(".verdict", root).innerHTML = Number.isFinite(doubles)
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

  const side = (which, wins) => {
    const box = root.querySelector(`[data-side="${which}"]`);
    box.classList.toggle("winner", wins);
    return box;
  };
  const sBox = side("s", sWins);
  const fBox = side("f", !sWins);

  sBox.querySelector("[data-k=gross]").textContent = money(sGross);
  sBox.querySelector("[data-k=tax]").textContent = `− ${money(sGross - sNet)}`;
  sBox.querySelector("[data-k=net]").textContent = money(sNet);
  sBox.querySelector("[data-k=total]").textContent = money(sTotal);

  fBox.querySelector("[data-k=gross]").textContent = money(fGross);
  fBox.querySelector("[data-k=tax]").textContent = `− ${money(fGross - fNet)}`;
  fBox.querySelector("[data-k=net]").textContent = money(fNet);
  fBox.querySelector("[data-k=total]").textContent = money(fTotal);

  $(".chart-box", root).innerHTML = barChart([
    { label: money(sTotal), caption: "সঞ্চয়পত্র", value: sTotal, color: "var(--green)" },
    { label: money(fTotal), caption: "FDR", value: fTotal, color: "var(--gold)" },
  ]);

  $(".verdict", root).innerHTML = gap < amount * 0.005
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
  $(".chart-box", root).innerHTML = areaChart(
    [
      { values: nominalSeries, color: "var(--gold)", fill: 0.12 },
      { values: realSeries, color: "var(--green)", fill: 0.18 },
    ],
    { labels: ["now", `year ${Math.round(years / 2)}`, `year ${years}`] }
  );

  $(".verdict", root).innerHTML = real >= 0
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
  $(".chart-box", root).innerHTML = areaChart(
    [
      { values: balances, color: "var(--green)", fill: 0.16 },
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

  $(".verdict", root).innerHTML = saved > 0
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
  $(".verdict", root).innerHTML = perShare <= 0
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

  const links = $$(".tool-tab", bar);
  const idOf = (a) => a.getAttribute("href").slice(1);

  // Only now does hiding become safe.
  document.body.dataset.toolTabs = "on";
  panels.forEach((p) => {
    p.setAttribute("role", "tabpanel");
    p.setAttribute("aria-labelledby", `tab-${p.id}`);
  });

  function show(id, { focus = false, push = false } = {}) {
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
    const a = e.target.closest(".tool-tab");
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
