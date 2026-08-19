/* ============================================================
   /tools/live.js: the live portfolio page, all three faces.

   This file is TypeScript and compiles to the served module:
   edit aab/src/tools/live.ts, run scripts/build-modules.ts,
   commit both. It is the first module served from a
   subdirectory; the MODULES list in that script names it as
   "tools/live".

   One page, three readers, decided at load and redecided when
   the account changes:

     a stranger        the site's own portfolio, percentages
                       only, from GET /api/broker/public.
     signed in         the same page grows a second half: paste
                       a Trading 212 key, keep it or don't, and
                       the dashboard reads YOUR account through
                       the Worker.
     the admin         a third panel: the key behind the public
                       numbers, the switches that decide what a
                       stranger sees, and the site account in
                       full.

   The key never touches this page's URL and never goes to any
   host but this site's own /api/broker, which is the only
   broker-shaped thing the CSP lets this page call. "Keep it"
   sends the key once, to be sealed server-side and stored in
   the reader's own row; "this tab only" keeps it in
   sessionStorage and sends it per request in a header, so
   closing the tab is the whole of revoking it.

   Drawing rules, so the charts stay readable and honest: every
   bar is a share of the same whole, one hue per job (accent for
   weight, green and red only ever for sign), values written in
   ink rather than in the bar's colour, and no second axis
   anywhere. The weight list and the dividend columns carry
   their numbers as text, so nothing here is colour-alone.

   The classes are in @layer tools in styles.css rather than
   Tailwind, deliberately: this DOM is built in a loop, and a
   class name inside createElement is invisible to Tailwind's
   scanner, which reads aab/*.js but not aab/tools/. CLAUDE.md,
   "Tailwind is live", the third row of the table.
   ============================================================ */
import { token, current } from "/account.js";
/* ---------- small helpers ---------- */
const $ = (id) => {
    const node = document.getElementById(id);
    if (!node)
        throw new Error(`missing #${id}`);
    return node;
};
const el = (tag, props = {}, ...kids) => {
    const node = Object.assign(document.createElement(tag), props);
    for (const kid of kids.flat(20)) {
        if (kid == null)
            continue;
        node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
    return node;
};
/* ---------- words for numbers ---------- */
const PCT = (n, { signed = true } = {}) => {
    if (n == null || Number.isNaN(n))
        return "–";
    const fixed = Math.abs(n) >= 100 ? n.toFixed(0) : n.toFixed(1);
    return `${signed && n > 0 ? "+" : ""}${fixed}%`;
};
const MONEY = (n, currency) => {
    if (n == null || Number.isNaN(n))
        return "–";
    try {
        return new Intl.NumberFormat("en-GB", {
            style: "currency", currency: currency || "GBP",
            maximumFractionDigits: Math.abs(n) >= 1000 ? 0 : 2,
        }).format(n);
    }
    catch {
        return `${n.toFixed(2)} ${currency ?? ""}`.trim();
    }
};
const QTY = (n) => {
    if (n == null)
        return "–";
    return Number(n) === Math.trunc(Number(n))
        ? String(n)
        : Number(n).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
};
const WHEN = (iso) => {
    if (!iso)
        return "";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("en-GB", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
};
const signClass = (n) => (n == null || n === 0 ? "" : n > 0 ? "live-up" : "live-down");
/* ---------- talking to the Worker ---------- */
async function call(path, { method = "GET", body, key } = {}) {
    const headers = {};
    const bearer = await token().catch(() => null);
    if (bearer)
        headers.Authorization = `Bearer ${bearer}`;
    if (body)
        headers["Content-Type"] = "application/json";
    if (key) {
        headers["x-broker-key"] = key.key;
        headers["x-broker-env"] = key.env;
    }
    try {
        const res = await fetch(`/api/broker/${path}`, {
            method, headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(20000),
        });
        return await res.json().catch(() => ({ ok: false, reason: "server-error" }));
    }
    catch {
        return { ok: false, reason: "network" };
    }
}
const WHY = {
    "bad-key": "The broker refused that key. Check it was copied whole, and that it is for the account kind you picked.",
    "rate-limited": "The broker is rate limiting. Give it a minute.",
    "broker-unreachable": "Trading 212 is not answering just now.",
    "broker-error": "Trading 212 answered with an error.",
    "no-key": "No key yet.",
    "stale-key": "The saved key cannot be opened any more. Paste it once more and save it again.",
    "sign-in-required": "The session has expired. Sign in again.",
    "bad-token": "The session has expired. Sign in again.",
    "too-many": "Too many requests in a short time. A pause fixes it.",
    "not-configured": "This half is not switched on yet.",
    network: "The request did not get through. Check the connection.",
};
const why = (data) => WHY[data?.reason ?? ""] ?? "That did not work. Try again in a moment.";
/* ---------- the per-tab key ---------- */
const TAB_KEY = "broker-tab-key";
const tabKey = () => {
    try {
        const raw = sessionStorage.getItem(TAB_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
};
const setTabKey = (value) => {
    try {
        if (value)
            sessionStorage.setItem(TAB_KEY, JSON.stringify(value));
        else
            sessionStorage.removeItem(TAB_KEY);
    }
    catch { /* a private window that forbids it still gets the session */ }
};
/* ============================================================
   The public half: anybody, no account, percentages only.
   ============================================================ */
function weightRow(h, largest) {
    const width = largest > 0 ? Math.max(2, ((h.weightPct ?? 0) / largest) * 100) : 0;
    return el("div", { className: "live-row" }, el("span", { className: "live-name" }, h.name || "–", h.ticker ? el("span", { className: "mono live-ticker" }, h.ticker) : null), el("span", { className: "live-bar" }, el("span", { className: "live-fill", style: `width:${width}%` })), el("span", { className: "mono live-weight" }, PCT(h.weightPct, { signed: false })), h.returnPct == null
        ? el("span", { className: "mono live-return" }, "")
        : el("span", { className: `mono live-return ${signClass(h.returnPct)}` }, PCT(h.returnPct)));
}
async function drawPublic() {
    const data = await call("public");
    const note = $("live-public-note");
    const host = $("live-public-holdings");
    if (!data.ok) {
        note.hidden = false;
        note.textContent = data.reason === "not-configured"
            ? "The site's own feed is not connected yet."
            : why(data);
        return;
    }
    const p = data.portfolio ?? {};
    const ret = $("live-public-return");
    ret.textContent = PCT(p.returnPct);
    ret.className = `v ${signClass(p.returnPct)}`;
    $("live-public-invested").textContent = PCT(p.investedPct, { signed: false });
    $("live-public-cash").textContent = PCT(p.cashPct, { signed: false });
    $("live-public-count").textContent = String(p.count ?? 0);
    if (Array.isArray(p.holdings) && p.holdings.length) {
        const largest = p.holdings[0]?.weightPct ?? 0;
        host.replaceChildren(el("div", { className: "live-row live-head mono" }, el("span", {}, "Holding"), el("span", {}, ""), el("span", {}, "Weight"), el("span", {}, "Return")), ...p.holdings.map((h) => weightRow(h, largest)));
    }
    else {
        host.replaceChildren(el("p", { className: "muted" }, "The list is switched off; the totals above are the public view."));
    }
    note.hidden = false;
    note.textContent = `As of ${WHEN(p.at)}. Weights are shares of the invested total.`;
}
/* ============================================================
   The reader's half: their account, in full, for their eyes.
   ============================================================ */
function statTile(k, v, n, cls = "") {
    return el("div", { className: "stat" }, el("span", { className: "k" }, k), el("span", { className: `v ${cls}`.trim() }, v), n ? el("span", { className: "n" }, n) : null);
}
function holdingsTable(positions, currency, invested) {
    const rows = [...positions].sort((a, b) => (b.walletImpact?.currentValue ?? 0) - (a.walletImpact?.currentValue ?? 0));
    const largest = rows[0]?.walletImpact?.currentValue ?? 0;
    return el("div", { className: "live-table" }, el("table", {}, el("thead", {}, el("tr", {}, ...["Holding", "Qty", "Avg paid", "Now", "Value", "P/L", "Weight"]
        .map((h) => el("th", {}, h)))), el("tbody", {}, rows.map((p) => {
        const w = p.walletImpact ?? {};
        const cost = w.totalCost ?? 0;
        const gain = w.unrealizedProfitLoss ?? 0;
        const gainPct = cost > 0 ? (gain / cost) * 100 : 0;
        const value = w.currentValue ?? 0;
        const weight = invested > 0 ? (value / invested) * 100 : 0;
        const width = largest > 0 ? Math.max(2, (value / largest) * 100) : 0;
        return el("tr", {}, el("td", {}, el("span", { className: "live-name" }, p.instrument?.name ?? "–"), el("span", { className: "mono live-ticker" }, String(p.instrument?.ticker ?? "").split("_")[0])), el("td", { className: "mono" }, QTY(p.quantity)), el("td", { className: "mono" }, MONEY(p.averagePricePaid, p.instrument?.currency)), el("td", { className: "mono" }, MONEY(p.currentPrice, p.instrument?.currency)), el("td", { className: "mono" }, MONEY(value, currency)), el("td", { className: `mono ${signClass(gain)}` }, `${MONEY(gain, currency)} (${PCT(gainPct)})`), el("td", {}, el("span", { className: "live-bar" }, el("span", { className: "live-fill", style: `width:${width}%` })), el("span", { className: "mono live-weight" }, PCT(weight, { signed: false }))));
    }))));
}
/* Dividends, summed by month, drawn as one row of columns. One
   hue, because one series; the numbers ride in each column's
   tooltip and the total in the heading, so nothing is
   colour-alone. */
function dividendChart(items, currency) {
    const byMonth = new Map();
    for (const d of items) {
        const month = String(d.paidOn ?? "").slice(0, 7);
        if (!month)
            continue;
        byMonth.set(month, (byMonth.get(month) ?? 0) + (d.amount ?? 0));
    }
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i -= 1) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        months.push(d.toISOString().slice(0, 7));
    }
    const values = months.map((m) => byMonth.get(m) ?? 0);
    const top = Math.max(...values, 0.01);
    const total = values.reduce((a, b) => a + b, 0);
    return el("div", { className: "live-block" }, el("h3", {}, "Dividends, last twelve months ", el("span", { className: "mono live-soft" }, MONEY(total, currency))), el("div", {
        className: "live-cols", role: "img",
        ariaLabel: `Dividends per month over the last year, totalling ${MONEY(total, currency)}`,
    }, months.map((m, i) => el("div", {
        className: "live-col",
        title: `${m}: ${MONEY(values[i], currency)}`,
    }, el("span", {
        className: "live-col-fill",
        style: `height:${Math.max((values[i] ?? 0) > 0 ? 4 : 1, ((values[i] ?? 0) / top) * 100)}%`,
    }), el("span", { className: "mono live-col-m" }, m.slice(5))))));
}
function activityLists(history, currency) {
    const wrap = el("div", { className: "grid-2 live-activity" });
    const orders = (history.orders ?? []).filter((o) => o.fill || o.order).slice(0, 8);
    wrap.append(el("div", { className: "live-block" }, el("h3", {}, "Recent fills"), orders.length
        ? el("ul", { className: "live-list" }, orders.map((o) => {
            const ord = o.order ?? {};
            const side = ord.side === "SELL" ? "Sold" : "Bought";
            return el("li", {}, el("span", {}, `${side} ${QTY(ord.filledQuantity ?? ord.quantity)} `, el("strong", {}, ord.instrument?.name ?? ord.ticker ?? "–")), el("span", { className: "mono live-soft" }, WHEN(o.fill?.filledAt ?? ord.createdAt)));
        }))
        : el("p", { className: "muted" }, "Nothing filled lately.")));
    const moves = (history.transactions ?? []).slice(0, 8);
    wrap.append(el("div", { className: "live-block" }, el("h3", {}, "Cash in and out"), moves.length
        ? el("ul", { className: "live-list" }, moves.map((t) => el("li", {}, el("span", {}, `${String(t.type ?? "").toLowerCase().replaceAll("_", " ")} `, el("strong", { className: signClass(t.amount) }, MONEY(t.amount, t.currency ?? currency))), el("span", { className: "mono live-soft" }, WHEN(t.dateTime)))))
        : el("p", { className: "muted" }, "No movements on the record.")));
    return wrap;
}
/** The whole dashboard for one account's data, reused by the
    admin's view of the site account. */
function accountDashboard(account, { title, note } = {}) {
    const s = account.summary ?? {};
    const currency = s.currency ?? "GBP";
    const inv = s.investments ?? {};
    const cash = s.cash ?? {};
    const cost = inv.totalCost ?? 0;
    const gainPct = cost > 0 ? ((inv.unrealizedProfitLoss ?? 0) / cost) * 100 : 0;
    const root = el("div", { className: "live-dash" });
    if (title) {
        root.append(el("p", { className: "mono live-soft" }, `${title} · as of ${WHEN(account.at)}${note ? ` · ${note}` : ""}`));
    }
    root.append(el("div", { className: "stat-row" }, statTile("Account value", MONEY(s.totalValue, currency), `all in, ${currency}`), statTile("Invested", MONEY(inv.currentValue, currency), `cost ${MONEY(cost, currency)}`), statTile("Unrealised", MONEY(inv.unrealizedProfitLoss, currency), `${PCT(gainPct)} on cost`, signClass(inv.unrealizedProfitLoss)), statTile("Realised, all time", MONEY(inv.realizedProfitLoss, currency), "", signClass(inv.realizedProfitLoss)), statTile("Free cash", MONEY(cash.availableToTrade, currency), cash.inPies ? `plus ${MONEY(cash.inPies, currency)} parked in pies` : "")));
    const positions = account.positions ?? [];
    if (positions.length) {
        root.append(el("div", { className: "live-block" }, el("h3", {}, `Holdings (${positions.length})`), holdingsTable(positions, currency, inv.currentValue ?? 0)));
    }
    else {
        root.append(el("p", { className: "muted" }, "No open positions."));
    }
    return root;
}
/* ---------- wiring the reader's half ---------- */
let ownKeyMode = null;
function showKeyForm() {
    $("live-signin").hidden = true;
    $("live-key-form").hidden = false;
}
async function drawOwn() {
    const out = $("live-own-out");
    out.hidden = false;
    out.replaceChildren(el("p", { className: "muted" }, "Asking the broker…"));
    const useKey = ownKeyMode === "saved" ? null : ownKeyMode;
    const live = await call("live", { key: useKey });
    if (!live.ok || !live.account) {
        out.replaceChildren(el("p", { className: "live-warn" }, why(live)));
        if (["bad-key", "no-key", "stale-key"].includes(live.reason ?? "")) {
            if (ownKeyMode !== "saved")
                setTabKey(null);
            showKeyForm();
        }
        return;
    }
    const currency = live.account.summary?.currency;
    const dash = accountDashboard(live.account, {
        title: ownKeyMode === "saved"
            ? "Your account, from the saved key"
            : "Your account, key held by this tab",
    });
    const bar = el("div", { className: "live-actions" }, el("button", {
        className: "btn btn-ghost", type: "button",
        onclick: () => { void drawOwn(); },
    }, "Refresh"), el("button", {
        className: "btn btn-ghost", type: "button",
        onclick: async () => {
            if (ownKeyMode === "saved")
                await call("key", { method: "DELETE" });
            setTabKey(null);
            ownKeyMode = null;
            out.hidden = true;
            out.replaceChildren();
            showKeyForm();
        },
    }, ownKeyMode === "saved" ? "Forget the saved key" : "Disconnect"));
    const wait = el("p", { className: "muted live-soft" }, "Loading history…");
    out.replaceChildren(dash, bar, wait);
    const hist = await call("history", { key: useKey });
    wait.remove();
    if (hist.ok && hist.history) {
        if (hist.history.dividends?.length) {
            out.insertBefore(dividendChart(hist.history.dividends, currency), bar);
        }
        out.insertBefore(activityLists(hist.history, currency), bar);
    }
}
/* The form is wired exactly once; deciding WHICH of the three
   states shows is the repeatable half, because account:changed
   can fire many times in one page's life and a listener per
   sign-in would submit the form that many times. */
function wireForm() {
    const form = $("live-key-form");
    const note = $("live-key-note");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const key = $("live-key").value.trim();
        const env = $("live-env").value;
        const save = $("live-save").checked;
        if (key.length < 16) {
            note.hidden = false;
            note.textContent = "That is too short to be a whole key.";
            return;
        }
        const connect = $("live-connect");
        connect.disabled = true;
        note.hidden = false;
        note.textContent = "Checking with the broker…";
        try {
            if (save) {
                const kept = await call("key", {
                    method: "PUT",
                    body: { key, env, label: $("live-label").value.trim() },
                });
                if (kept.ok) {
                    ownKeyMode = "saved";
                }
                else if (kept.reason === "not-configured") {
                    /* Sealing is off server-side; fall back to the tab,
                       and say so rather than silently downgrading. */
                    setTabKey({ key, env });
                    ownKeyMode = { key, env };
                    note.textContent = "Storing keys is off right now, so this one is kept by this tab only.";
                }
                else {
                    note.textContent = why(kept);
                    return;
                }
            }
            else {
                setTabKey({ key, env });
                ownKeyMode = { key, env };
            }
            note.hidden = true;
            form.hidden = true;
            $("live-key").value = "";
            await drawOwn();
        }
        finally {
            connect.disabled = false;
        }
    });
}
async function decideOwn() {
    const me = await call("me");
    if (!me.ok) {
        /* Signed out, or the session died: the ask stays. */
        return;
    }
    if (me.admin)
        await drawAdmin();
    if (me.saved) {
        ownKeyMode = "saved";
        $("live-signin").hidden = true;
        await drawOwn();
        return;
    }
    const held = tabKey();
    if (held) {
        ownKeyMode = held;
        $("live-signin").hidden = true;
        await drawOwn();
        return;
    }
    showKeyForm();
}
/* ============================================================
   The admin's half.
   ============================================================ */
async function drawAdmin() {
    const section = $("live-admin");
    const out = $("live-admin-out");
    section.hidden = false;
    out.replaceChildren(el("p", { className: "muted" }, "Fetching the site account…"));
    const data = await call("site");
    if (!data.ok || !data.view) {
        out.replaceChildren(el("p", { className: "live-warn" }, why(data)));
        return;
    }
    const view = data.view;
    /* -- the site key -- */
    const keyInput = el("input", {
        type: "password", placeholder: "site Trading 212 key", autocomplete: "off",
    });
    const envPick = el("select", {}, el("option", { value: "live" }, "Real money"), el("option", { value: "demo" }, "Practice (paper)"));
    const keyNote = el("span", { className: "mono live-form-note" });
    const keyForm = el("form", { className: "live-key-grid live-admin-form" }, el("label", {}, "Public feed key", keyInput), el("label", {}, "Account", envPick), el("div", { className: "live-actions" }, el("button", { className: "btn btn-solid", type: "submit" }, "Set"), el("button", {
        className: "btn btn-ghost", type: "button",
        onclick: async () => {
            await call("site-key", { method: "DELETE" });
            keyNote.textContent = "Cleared. The public section will say it is not connected.";
            void drawPublic();
        },
    }, "Clear"), keyNote));
    keyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        keyNote.textContent = "Checking…";
        const set = await call("site-key", {
            method: "PUT",
            body: { key: keyInput.value.trim(), env: envPick.value },
        });
        keyNote.textContent = set.ok
            ? `Set. The feed answers in ${set.currency || "its own currency"}.`
            : why(set);
        if (set.ok) {
            keyInput.value = "";
            void drawPublic();
        }
    });
    /* -- the public view's switches -- */
    const holdBox = el("input", { type: "checkbox", checked: view.holdings });
    const nameBox = el("input", { type: "checkbox", checked: view.names });
    const retBox = el("input", { type: "checkbox", checked: view.returns });
    const maxBox = el("input", {
        type: "number", min: "1", max: "100", value: String(view.max),
    });
    const viewNote = el("span", { className: "mono live-form-note" });
    const viewForm = el("form", { className: "live-admin-form" }, el("label", { className: "live-remember" }, holdBox, el("span", {}, "Show the holdings list at all")), el("label", { className: "live-remember" }, nameBox, el("span", {}, "Name the holdings, or number them by size")), el("label", { className: "live-remember" }, retBox, el("span", {}, "Show each holding's own return")), el("label", { className: "live-remember" }, el("span", {}, "Rows at most"), maxBox), el("div", { className: "live-actions" }, el("button", { className: "btn btn-solid", type: "submit" }, "Save the public view"), el("button", {
        className: "btn btn-ghost", type: "button",
        onclick: async () => {
            viewNote.textContent = "Refreshing…";
            const done = await call("refresh", { method: "POST" });
            viewNote.textContent = done.ok ? `Fresh as of ${WHEN(done.at)}.` : why(done);
            void drawPublic();
        },
    }, "Refresh the snapshot now"), viewNote));
    viewForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const saved = await call("view", {
            method: "PUT",
            body: {
                holdings: holdBox.checked, names: nameBox.checked,
                returns: retBox.checked, max: Number(maxBox.value) || 30,
            },
        });
        viewNote.textContent = saved.ok ? "Saved." : why(saved);
        void drawPublic();
    });
    out.replaceChildren(el("p", { className: "mono live-soft" }, data.source === "secret"
        ? "The public feed is on the T212_PUBLIC_TOKEN secret; a key set here only takes over if that secret is removed."
        : data.source === "saved"
            ? "The public feed runs on a key set here, sealed into the site's own database."
            : "No public feed key is set yet."), keyForm, viewForm);
    if (data.snapshot) {
        out.append(accountDashboard(data.snapshot, {
            title: "The site account, in full",
            note: "only admins see this",
        }));
    }
}
/* ============================================================ */
function boot() {
    void drawPublic();
    wireForm();
    void decideOwn();
    /* Signing in or out on the account popover re-decides the
       whole right half without a reload. */
    document.addEventListener("account:changed", () => {
        $("live-signin").hidden = false;
        $("live-key-form").hidden = true;
        $("live-own-out").hidden = true;
        $("live-admin").hidden = true;
        ownKeyMode = null;
        if (current())
            void decideOwn();
    });
}
boot();
