/* ============================================================
   learn/progress.test.mjs: the money ladder is its own school.

     node aab/learn/progress.test.mjs
     (needs a server on :8899 and Playwright; skips without them)

   THE BUG THIS EXISTS FOR

   app.js calls recordVisit() from this school's progress module on
   EVERY page of the site, so the selector inside it is the only
   thing deciding which pages belong to the money ladder. It used to
   be `article[data-lesson-id]`, and the Qur'an school's lessons and
   the English school's parts carry `data-lesson-id` too.

   So ninety pages of other schools marked themselves as money
   ladder lessons. The ladder's percentages counted them, the
   bookmark could point the home page's "money ladder" card at an
   Arabic lesson, and worst of all the school could not be reset:
   clear it on the hub, open any Qur'an or English lesson, and one
   was straight back in the set. No number of presses could win,
   because the reset and the thing undoing it were on different
   pages. That is exactly how it was reported.

   Only /learn/ writes `data-stage`, which is what the selector
   requires now, and readSet() drops anything that is not one of
   this school's own ids so devices already polluted heal
   themselves the first time they are opened.
   ============================================================ */

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("Playwright is not installed, so this test is skipped.");
  process.exit(0);
}

try {
  const res = await fetch("http://localhost:8899/learn/index.html");
  if (!res.ok) throw new Error(String(res.status));
} catch {
  console.log("No server on :8899, so this test is skipped.");
  console.log("  cd aab && python3 -m http.server 8899");
  process.exit(0);
}

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
let fails = 0;
const check = (n,g,w)=>{const ok=JSON.stringify(g)===JSON.stringify(w);if(!ok)fails++;console.log(`  ${ok?"ok  ":"FAIL"} ${n}${ok?"":`\n        got  ${JSON.stringify(g)}\n        want ${JSON.stringify(w)}`}`);};

const ctx = await b.newContext({ viewport:{width:1100,height:900}, serviceWorkers:"block" });
const p = await ctx.newPage();
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
await ctx.route("**/api/**", r=>r.fulfill({status:200,contentType:"application/json",body:'{"ok":true,"articles":[]}'}));
await ctx.route("https://wvjarqnnmkkuxyrndtya.supabase.co/**", r=>r.fulfill({status:200,contentType:"application/json",body:"[]"}));

/* Seeded ONCE, not through addInitScript: that re-runs on every
   navigation, which would put the pollution back after each reset
   and test nothing at all. */
await p.goto("http://localhost:8899/learn/index.html", { waitUntil:"domcontentloaded" });
await p.evaluate(() => {
  localStorage.setItem("learn-read", JSON.stringify(
    ["share","bo-account","dhap-1/tin-prokar","term-1/verbs","basics-3/cash-flow"]));
  localStorage.setItem("learn-last", JSON.stringify(
    { id:"dhap-1/tin-prokar", stage:"basics-1", url:"/quran/dhap-1/tin-prokar.html", bn:"শব্দের তিন প্রকার", ts:Date.now() }));
});
await p.reload({ waitUntil:"domcontentloaded" });
await p.waitForTimeout(1200);

const after = await p.evaluate(async () => {
  const m = await import("/learn/progress.js");
  return { read:[...m.readSet()].sort(), last:m.getLast()?.id ?? null, stored:JSON.parse(localStorage.getItem("learn-read")) };
});
console.log("polluted device, after one visit to the learn hub");
check("foreign ids dropped from the set", after.read, ["bo-account","basics-3/cash-flow","share"].sort());
check("and dropped from storage too", after.stored.sort(), ["bo-account","basics-3/cash-flow","share"].sort());
check("a foreign bookmark is discarded", after.last, null);

// Now: reset, then visit a Qur'an lesson, and it must STAY reset.
await p.evaluate(async()=>{ (await import("/learn/progress.js")).resetAll(); });
await p.waitForTimeout(300);
check("reset empties it", await p.evaluate(async()=>[...(await import("/learn/progress.js")).readSet()]), []);

await p.goto("http://localhost:8899/quran/dhap-1/purush-stri.html", { waitUntil:"domcontentloaded" });
await p.waitForTimeout(1200);
await p.goto("http://localhost:8899/learn/index.html", { waitUntil:"domcontentloaded" });
await p.waitForTimeout(900);
check("and a Qur'an lesson does NOT put it back",
  await p.evaluate(async()=>[...(await import("/learn/progress.js")).readSet()]), []);

// A real learn lesson still ticks.
await p.goto("http://localhost:8899/learn/basics-3/cash-flow.html", { waitUntil:"domcontentloaded" });
await p.waitForTimeout(1200);
check("a real learn lesson still ticks",
  await p.evaluate(async()=>[...(await import("/learn/progress.js")).readSet()]), ["basics-3/cash-flow"]);
console.log("errors:", errs.length?errs[0]:"none");
await b.close();
console.log(fails?`\n${fails} failure(s)`:"\nall good");
process.exit(fails?1:0);
