/* ============================================================
   sync.test.mjs: the three ways progress went wrong.

     node aab/sync.test.mjs        (needs a server on :8899 and
                                    Playwright; skips without them)

   Each of these was reported by a reader of this site, not found
   by reading the code, and each is the kind of bug that only
   exists when a browser, a clock and a network are all involved:

   1. RESETTING DID NOTHING while signed in. Every school's
      resetAll() removes its key rather than emptying it, and the
      guard in reconcile() only recognised []. So `undefined` fell
      through to the union and the account's copy came straight
      back, every time.

   2. SIGNING IN ON A SECOND DEVICE silently pushed whatever that
      browser happened to hold into the account, permanently. Fine
      on your own laptop; not fine on a borrowed phone or a new
      account that should start new. It asks now, once, and only
      when both sides actually hold something.

   3. The three answers to that question each have to do exactly
      what they say, and "use my account's" is the one that went
      wrong twice while being written: once by clearing the account
      it was supposed to adopt, and once by announcing the change
      and feeding its own clock back through the schools.

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

try {
  const res = await fetch("http://localhost:8899/index.html");
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
    return json({});
  });
  await ctx.route(`${SUPA}/auth/v1/**`, (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await ctx.route("**/api/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"articles":[]}' }));

  await p.addInitScript((d) => { for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v); }, device);
  return { ctx, p, state, errs };
}

const old = new Date(Date.now() - 600000).toISOString();

/* ---------- 1. reset while signed in ---------- */
console.log("resetting progress while signed in");
{
  const { ctx, p, state, errs } = await make({
    accountRows: [
      { key: "learn-read", value: ["share", "dse"], updated_at: old },
      { key: "learn-last", value: { id: "share", ts: Date.now() - 600000 }, updated_at: old },
    ],
    device: {
      "reiad-session": session("u-reset"),
      "learn-read": JSON.stringify(["share", "dse"]),
      "learn-last": JSON.stringify({ id: "share", ts: Date.now() - 600000 }),
      "sync-accounts": JSON.stringify(["u-reset"]),
    },
  });
  await p.goto("http://localhost:8899/index.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1600);

  check("account starts with the progress", state.rows.has("learn-read"), true);

  // Exactly what the school's own reset does.
  await p.evaluate(async () => {
    const m = await import("/learn/progress.js");
    m.resetAll();
  });
  await p.waitForTimeout(4000);

  const after = await p.evaluate(() => ({
    read: localStorage.getItem("learn-read"),
    last: localStorage.getItem("learn-last"),
  }));
  // Either absent or an empty list counts as cleared; what must NOT
  // happen is the account's copy coming back.
  check("the device stays cleared", JSON.parse(after.read ?? "null") ?? [], []);
  check("the bookmark stays cleared", after.last, null);
  check("and the account is cleared too", state.rows.get("learn-read")?.value ?? null, []);
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

/* ---------- 2. first contact on a device that already has progress ---------- */
console.log("\nsigning in on a browser that already has progress");
for (const [answer, wantDevice, wantAccount] of [
  ["merge", ["a", "b"], ["a", "b"]],
  ["account", ["a"], ["a"]],
  ["device", ["b"], ["b"]],
]) {
  const { ctx, p, state, errs } = await make({
    accountRows: [{ key: "learn-read", value: ["a"], updated_at: old }],
    device: {
      "reiad-session": session("u-new"),
      "learn-read": JSON.stringify(["b"]),
    },
  });
  await p.goto("http://localhost:8899/index.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1500);

  const asked = await p.locator("dialog.first-sync").isVisible().catch(() => false);
  if (asked) {
    const labels = { merge: "Keep both", account: "Use my account's", device: "Use this browser's" };
    await p.getByRole("button", { name: labels[answer] }).click();
    await p.waitForTimeout(2500);
  }
  const local = await p.evaluate(() => JSON.parse(localStorage.getItem("learn-read") ?? "null"));
  console.log(`  answer "${answer}": asked=${asked}`);
  check(`  device ends with`, (local ?? []).sort(), wantDevice);
  check(`  account ends with`, (state.rows.get("learn-read")?.value ?? []).sort(), wantAccount);
  check("  no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

/* ---------- 3. it does NOT ask when there is nothing to lose ---------- */
console.log("\nand it does not ask when nothing could be lost");
{
  const { ctx, p, errs } = await make({
    accountRows: [],
    device: { "reiad-session": session("u-empty"), "learn-read": JSON.stringify(["b"]) },
  });
  await p.goto("http://localhost:8899/index.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1800);
  check("empty account: no question", await p.locator("dialog.first-sync").count(), 0);
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

/* ---------- 4. changing the name ---------- */
console.log("\nchanging the display name");
{
  const { ctx, p, state, errs } = await make({
    profile: { display_name: "Rony", following: ["deutsch"], pace: "often", setup_at: new Date().toISOString() },
    device: { "reiad-session": session("u-name"), "sync-accounts": JSON.stringify(["u-name"]) },
  });
  await p.goto("http://localhost:8899/account.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1800);

  check("the field is filled from the profile", await p.locator("#account-name").inputValue(), "Rony");
  await p.fill("#account-name", "Rony Reiad");
  await p.click("#settings-form button[type=submit]");
  await p.waitForTimeout(1200);

  check("it PATCHed the new name", state.patches.at(-1)?.display_name, "Rony Reiad");
  check("it said so", await p.locator("#settings-note").textContent(), "Saved.");
  check("the greeting updated", (await p.locator("#account-hello").textContent())?.includes("Rony Reiad"), true);
  check("the header button updated", (await p.locator(".account-btn").textContent())?.trim().length > 0, true);
  check("no page errors", errs.length ? errs[0] : "none", "none");
  await ctx.close();
}

await b.close();
console.log(fails ? `\n${fails} failure(s)` : "\nall good");
process.exit(fails ? 1 : 0);
