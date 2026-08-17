/* ============================================================
   sync.test.mjs: progress belongs to the account.

     node aab/sync.test.mjs        (needs a server on :8899 and
                                    Playwright; skips without them)

   The old file tested a three-way merge and the dialog that
   fronted it. Both are gone, so this is a rewrite rather than an
   edit, and what it holds `aab/sync.js` to is one sentence:

     THE ACCOUNT IS THE RECORD, AND NOTHING IS EVER PULLED OUT OF
     THE BROWSER INTO IT.

   Five things follow from that sentence and each of them is a
   check below. Three were bugs in the old shape, one is the rule
   itself, and one is what signing out has to do once the device
   is a mirror rather than a second copy.

   1. SIGNING IN ADOPTS. A browser that already holds progress
      shows the account's, and what it held is neither merged nor
      uploaded. The old file asked the reader which they wanted,
      because it could not tell a laptop from a borrowed phone.
      Nothing has to tell them apart now.

   2. A TICK MADE WHILE SIGNED IN GOES UP. Adoption must not be
      mistaken for read-only: everything done after signing in is
      the account's.

   3. RESETTING CLEARS THE ACCOUNT. Every school's resetAll()
      REMOVES its key rather than emptying it, and the old guard
      recognised only an empty array, so `undefined` fell through
      a union and the account's copy came straight back, every
      time. There is no guard here: an absent key is an empty set
      and subtraction does the rest.

   4. A TICK FROM ANOTHER DEVICE ARRIVES. Two signed-in devices
      is the one case that still needs reconciling, and it is
      reconciled between two states that both came from the
      account.

   5. SIGNING OUT TAKES THE MIRROR OFF. The next person at the
      same machine must not inherit the last one's ticks.

   Plus the display name, which is checked here because it shares
   the profile path with everything above.
   ============================================================ */

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("Playwright is not installed, so this test is skipped.");
  process.exit(0);
}

/* /404.html rather than /index.html, and the reason is worth
   writing down because the old file did not notice: the home page
   has not been a file in `aab/` since archive/TRANSITION.md Stage
   11.5. A static server over this directory answers it with a
   404, so every navigation in the old version of this test landed
   on nothing and every assertion after it was about an empty
   page.

   404.html is one of the six pages that are not routes and cannot
   be, it loads `/app.js` like every other page on the site, and
   app.js imports signin.js, which imports sync.js and starts it.
   That is the whole of what these checks need a page for. */
try {
  const res = await fetch("http://localhost:8899/404.html");
  if (!res.ok) throw new Error(String(res.status));
} catch {
  console.log("No server on :8899, so this test is skipped.");
  console.log("  cd aab && python3 -m http.server 8899");
  process.exit(0);
}

const SUPA = "https://wvjarqnnmkkuxyrndtya.supabase.co";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (sub) => [b64({ alg: "HS256" }),
  b64({ sub, email: "i@reiad.co.uk", exp: Math.floor(Date.now() / 1000) + 3600,
        user_metadata: { full_name: "Rony Reiad" } }), "s"].join(".");
const session = (sub) => JSON.stringify({ access_token: jwt(sub), refresh_token: "r",
  expires_at: Date.now() + 3600e3, user: { id: sub, email: "i@reiad.co.uk", name: "Rony Reiad" } });

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

let fails = 0;
const check = (n, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${n}${ok ? "" : `\n        got  ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`}`);
};

/** A browser holding `device`, talking to an account holding
    `accountRows`. Every Supabase call is answered here, so the
    real project is never touched and the test needs no network. */
async function make({ accountRows = [], profile = null, device = {} }) {
  const ctx = await b.newContext({ viewport: { width: 1100, height: 1000 }, serviceWorkers: "block" });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  const state = { rows: new Map(accountRows.map((r) => [r.key, r])), profile, patches: [], deletes: 0 };

  await ctx.route(`${SUPA}/rest/v1/**`, async (route) => {
    const req = route.request(); const u = new URL(req.url());
    const json = (o, s = 200) => route.fulfill({ status: s, contentType: "application/json", body: JSON.stringify(o) });
    if (u.pathname.endsWith("/profiles")) {
      if (req.method() === "PATCH") { const patch = JSON.parse(req.postData()); state.patches.push(patch); state.profile = { ...state.profile, ...patch }; return route.fulfill({ status: 204, body: "" }); }
      return json(state.profile ? [state.profile] : []);
    }
    if (u.pathname.endsWith("/progress")) {
      if (req.method() === "DELETE") { state.deletes++; state.rows.clear(); return route.fulfill({ status: 204, body: "" }); }
      if (req.method() === "POST") {
        JSON.parse(req.postData()).forEach((r) => state.rows.set(r.key, { ...r, updated_at: new Date().toISOString() }));
        return route.fulfill({ status: 201, body: "" });
      }
      return json([...state.rows.values()]);
    }
    /* Scenarios and targets: empty, and answered rather than left
       to fail, because the account page asks for both and a
       rejected fetch is a console error this file counts. */
    return json([]);
  });
  await ctx.route(`${SUPA}/auth/v1/**`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await ctx.route("**/api/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"articles":[]}' }));

  await p.addInitScript((d) => { for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v); }, device);
  return { ctx, p, state, errs };
}

const old = new Date(Date.now() - 600000).toISOString();
const local = (p, key) => p.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), key);
const sorted = (v) => (Array.isArray(v) ? [...v].sort() : v);

/* ---------- 1. signing in adopts, and uploads nothing ---------- */
console.log("signing in on a browser that already has progress");
{
  const { ctx, p, state, errs } = await make({
    accountRows: [{ key: "learn-read", value: ["a"], updated_at: old }],
    device: {
      "reiad-session": session("u-adopt"),
      /* Somebody else's afternoon on a shared machine, or this
         reader's own guest visit. The site cannot tell, and under
         the new rule it does not have to. */
      "learn-read": JSON.stringify(["b", "c"]),
      "deutsch-read": JSON.stringify(["stufe-1/anfang"]),
    },
  });
  await p.goto("http://localhost:8899/404.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2500);

  check("the device holds the account's", sorted(await local(p, "learn-read")), ["a"]);
  check("a key the account does not have is dropped", await local(p, "deutsch-read"), null);
  check("and nothing of the browser's went up",
    sorted(state.rows.get("learn-read")?.value ?? []), ["a"]);
  check("the account gained no second key", [...state.rows.keys()], ["learn-read"]);
  check("nothing was asked", await p.locator("dialog.first-sync").count(), 0);
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

/* ---------- 2. a tick made while signed in goes up ---------- */
console.log("\nticking a lesson while signed in");
{
  const { ctx, p, state, errs } = await make({
    accountRows: [{ key: "learn-read", value: ["a"], updated_at: old }],
    device: { "reiad-session": session("u-tick") },
  });
  await p.goto("http://localhost:8899/404.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2000);

  // Exactly what a tick button does: write the key, announce it.
  await p.evaluate(() => {
    localStorage.setItem("learn-read", JSON.stringify(["a", "share"]));
    dispatchEvent(new CustomEvent("learn:progress"));
  });
  await p.waitForTimeout(4000);

  check("the account has both", sorted(state.rows.get("learn-read")?.value ?? []), ["a", "share"]);
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

/* ---------- 3. resetting clears the account ---------- */
console.log("\nresetting progress while signed in");
{
  const { ctx, p, state, errs } = await make({
    accountRows: [
      { key: "learn-read", value: ["share", "dse"], updated_at: old },
      { key: "learn-last", value: { id: "share", ts: Date.now() - 600000 }, updated_at: old },
    ],
    device: { "reiad-session": session("u-reset") },
  });
  await p.goto("http://localhost:8899/404.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2000);

  check("the device adopted the account's", sorted(await local(p, "learn-read")), ["dse", "share"]);

  // Exactly what the school's own reset does: remove, not empty.
  await p.evaluate(() => {
    for (const key of ["learn-read", "learn-last"]) localStorage.removeItem(key);
    dispatchEvent(new CustomEvent("learn:progress"));
  });
  await p.waitForTimeout(4000);

  check("the device stays cleared", (await local(p, "learn-read")) ?? [], []);
  check("the bookmark stays cleared", await local(p, "learn-last"), null);
  check("and the account is cleared too", state.rows.get("learn-read")?.value ?? null, []);
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

/* ---------- 4. a tick from another device arrives ---------- */
console.log("\na tick made on another device");
{
  const { ctx, p, state, errs } = await make({
    accountRows: [{ key: "learn-read", value: ["a"], updated_at: old }],
    device: { "reiad-session": session("u-two") },
  });
  await p.goto("http://localhost:8899/404.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2000);

  /* The phone, which this browser knows nothing about, and one
     tick here at the same time. Neither may lose the other. */
  state.rows.set("learn-read", { key: "learn-read", value: ["a", "phone"], updated_at: new Date().toISOString() });
  await p.evaluate(() => {
    localStorage.setItem("learn-read", JSON.stringify(["a", "laptop"]));
    dispatchEvent(new CustomEvent("learn:progress"));
  });
  await p.waitForTimeout(4000);

  check("the account holds both", sorted(state.rows.get("learn-read")?.value ?? []), ["a", "laptop", "phone"]);
  check("and so does this device", sorted(await local(p, "learn-read")), ["a", "laptop", "phone"]);
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

/* ---------- 5. signing out takes the mirror off ---------- */
console.log("\nsigning out");
{
  const { ctx, p, state, errs } = await make({
    accountRows: [{ key: "learn-read", value: ["a", "b"], updated_at: old }],
    device: { "reiad-session": session("u-out") },
  });
  await p.goto("http://localhost:8899/404.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2000);
  check("the mirror is on the device", sorted(await local(p, "learn-read")), ["a", "b"]);

  await p.evaluate(async () => {
    const m = await import("/account.js");
    await m.signOut();
  });
  await p.waitForTimeout(1500);

  check("and it comes off again", await local(p, "learn-read"), null);
  check("the account is untouched", sorted(state.rows.get("learn-read")?.value ?? []), ["a", "b"]);
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

/* ---------- 6. changing the name ----------

   Driven through `/account.js` rather than through the account
   page's form, and that is a change from the old file rather than
   a shortcut. This harness is a static server over `aab/`, and
   `/account.html` has not been a file in `aab/` since
   archive/TRANSITION.md Stage 11.5: it is a Next.js route, so the
   old version of this check was navigating to a 404 and asserting
   against an empty page. What it was really testing is the
   profile path the whole of this file shares, and that is a
   module. `app/desk.test.mjs` is the pattern for driving a
   rendered page, and needs a build this file does not. */
console.log("\nchanging the display name");
{
  const { ctx, p, state, errs } = await make({
    profile: { display_name: "Rony", following: ["deutsch"], pace: "often", setup_at: new Date().toISOString() },
    device: { "reiad-session": session("u-name") },
  });
  await p.goto("http://localhost:8899/404.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1500);

  const before = await p.evaluate(async () => {
    const m = await import("/account.js");
    return (await m.getProfile())?.display_name ?? null;
  });
  check("the profile row is read", before, "Rony");

  await p.evaluate(async () => {
    const m = await import("/account.js");
    await m.setDisplayName("Rony Reiad");
  });
  await p.waitForTimeout(800);

  check("it PATCHed the new name", state.patches.at(-1)?.display_name, "Rony Reiad");
  check("the session carries it", await p.evaluate(async () => {
    const m = await import("/account.js");
    return m.current()?.name ?? null;
  }), "Rony Reiad");
  check("the header button updated",
    (await p.locator(".account-btn").textContent())?.trim(), "R");
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

await b.close();
console.log(fails ? `\n${fails} failure(s)` : "\nall good: the account is the record");
process.exit(fails ? 1 : 0);
