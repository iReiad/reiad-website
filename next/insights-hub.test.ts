/* ============================================================
   insights-hub.test.ts: the two pieces of behaviour the Insights
   hub has, in a browser.

     node next/insights-hub.test.ts

   Needs Playwright and a browser. Without either it says which and
   skips, and a skip is not a pass.

   `archive/modules/hub.js` was 97 lines and it did two things:
   the topic chips above the article cards, and the subscribe box
   under the RSS line. They are `components/topic-filter.tsx` and
   `components/subscribe.tsx` now, and a port is finished when it
   does what the thing it replaced did, not when it renders, so
   what that module did is written down here.

   ---- why a browser ----

   Both halves do nothing at all until React has hydrated: one is a
   click and the other is an effect. Reading the markup would show
   a chip row and a hidden form and say nothing about either, which
   is exactly the shape `interactive.test.ts` exists for, and
   `/insights` is `force-dynamic` so that file cannot serve
   it. `hydrate-fixture.ts` is the smaller way in: the components,
   server-rendered and hydrated, on a page of their own.

   ---- and why the API is a file this test serves ----

   `subscribe.tsx` reads `/api.js` through `runtimeModule()`, which
   is a real `import()` in the browser resolved against whatever
   origin the page came from. So the stub below IS `/api.js` as far
   as the component is concerned: no mock, no injection, and the
   component under test is the one the route ships.
   ============================================================ */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load, open } from "./hydrate-fixture.ts";
import type { Piece } from "./lib/pieces.ts";
import type { ConsoleMessage, Page } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8993;

/* Five pieces, arranged so every rule the chips follow has
   something to say. Equities is on three and Beginner on two, so
   the order is by count; Banks and Bonds are on one each, so the
   tie is broken alphabetically. `quiet-piece` carries no topic at
   all, which is the case a filter forgets. */
const PIECES: Piece[] = [
  { slug: "dsex-basics", title: "What DSEX actually measures", dek: "The index, plainly.",
    tag: "Explainer", topics: ["Equities", "Beginner"], lang: "en", minutes: 8,
    section: "insights", date: "2026-08-01", url: "/insights/dsex-basics.html", cover: "" },
  { slug: "bo-account", title: "Opening a BO account", dek: "Every step and every fee.",
    tag: "Guide", topics: ["Equities", "Beginner"], lang: "en", minutes: 6,
    section: "insights", date: "2026-07-20", url: "/insights/bo-account.html", cover: "" },
  { slug: "tbill-ladder", title: "A treasury bill ladder", dek: "Where a saver's taka waits.",
    tag: "Note", topics: ["Bonds", "Equities"], lang: "en", minutes: 5,
    section: "insights", date: "2026-07-10", url: "/insights/tbill-ladder.html", cover: "" },
  { slug: "bank-margins", title: "What a bank earns on your deposit", dek: "The spread.",
    tag: "Explainer", topics: ["Banks"], lang: "en", minutes: 7,
    section: "insights", date: "2026-07-05", url: "/insights/bank-margins.html", cover: "" },
  { slug: "quiet-piece", title: "A piece with no topics", dek: "Filed under nothing.",
    tag: "Note", topics: [], lang: "en", minutes: 3,
    section: "insights", date: "2026-07-01", url: "/insights/quiet-piece.html", cover: "" },
];

const SOON = [{ title: "Sanchayapatra vs. FDR", dek: "Promised, not written." }];

const DATA = JSON.stringify({ pieces: PIECES, soon: SOON });

/* ---------- the server's half, rendered here ---------- */

interface Server {
  renderToString: (node: unknown) => string;
  markup: (data: string) => unknown;
}

const { renderToString, markup } = await load<Server>(`
  import { createElement as h } from "react";
  import { TopicFilter } from "./components/topic-filter";
  import { SubscribeBox } from "./components/subscribe";
  import { SoonCard } from "./components/deck";
  export { renderToString } from "react-dom/server.browser";
  export const markup = (data) => {
    const { pieces, soon } = JSON.parse(data);
    return h("div", null,
      h("section", null, h(TopicFilter, { pieces },
        soon.map((s) => h(SoonCard, { key: s.title, title: s.title, dek: s.dek, soon: "Coming soon" })))),
      h("section", null, h(SubscribeBox, null)));
  };
`);

const served = renderToString(markup(DATA));

/* ---------- and the browser's, hydrating that exact markup ---------- */

const fixture = await open({
  port: PORT,
  body: `<div id="root">${served}</div>`
    + `<script type="application/json" id="fixture">${DATA}</script>`,
  entry: `
    import { createElement as h } from "react";
    import { hydrateRoot } from "react-dom/client";
    import { TopicFilter } from "./components/topic-filter";
    import { SubscribeBox } from "./components/subscribe";
    import { SoonCard } from "./components/deck";
    const { pieces, soon } = JSON.parse(document.getElementById("fixture").textContent);
    hydrateRoot(document.getElementById("root"),
      h("div", null,
        h("section", null, h(TopicFilter, { pieces },
          soon.map((s) => h(SoonCard, { key: s.title, title: s.title, dek: s.dek, soon: "Coming soon" })))),
        h("section", null, h(SubscribeBox, null))));
  `,
  files: {
    /* The stub is the endpoint's own vocabulary and nothing else:
       `{ ok }`, `{ already }` and `{ ok, confirmUrl }` are the
       three answers `functions/api/subscribers` gives, and a
       refusal is the fourth. Which one comes back is whatever the
       page put in `window.__reply` before it loaded, so one file
       walks all four, and `window.__ready` is the deployment that
       has no database at all. */
    "/api.js": {
      type: "text/javascript; charset=utf-8",
      body: `
        export const backendReady = async () => window.__ready !== false;
        export const subscribe = async (payload) => {
          window.__sent = payload;
          return window.__reply ?? { ok: true };
        };
      `,
    },
  },
});

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};

/** React only says a hydration mismatch out loud in development,
    and says it as a numbered error once minified. Both spellings
    are watched, because this bundle is the first and the site's is
    the second. */
const mismatches = (errors: string[]): string[] => errors.filter((e) =>
  /Minified React error #(418|423|425)|did not match|Hydration failed/i.test(e));

/** One page, opened and hydrated. `before` runs in the page ahead
    of any script, which is how the stub above is told what to say. */
const openPage = async (before?: string): Promise<{ page: Page; errors: string[] }> => {
  const page = await fixture.browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error") errors.push(m.text());
  });
  if (before) await page.addInitScript(before);
  await page.goto(fixture.origin, { waitUntil: "load" });
  /* The form is hidden in the server's HTML and unhidden by an
     effect, so it being visible is proof that React has hydrated
     and run one. Nothing below has to guess at a timeout. */
  if (!before?.includes("__ready = false")) {
    await page.waitForFunction(() =>
      (document.querySelector("#subscribe-form") as HTMLElement | null)?.hidden === false);
  }
  return { page, errors };
};

console.log("the Insights hub's own behaviour");

/* ============================================================
   1. What the server sends, which is what a reader with no
      JavaScript keeps
   ============================================================ */
{
  ok("the chips are in the HTML rather than built after a fetch",
    served.includes('class="filter-row"') && served.includes('id="topic-filter"'),
    served.slice(0, 200));
  ok("Everything counts the cards under it", served.includes("Everything · 5"), served);
  ok("and each topic counts its own",
    served.includes("Equities · 3") && served.includes("Beginner · 2")
    && served.includes("Banks · 1") && served.includes("Bonds · 1"), served);
  ok("every card ships visible", !/data-kind="go"[^>]*hidden/.test(served));
  /* The deck's soon card, which is what the hub renders. It was
     `cell sample-card placeholder` here, the markup of a SECOND
     `SoonCard` that lived in `cards.tsx` beside the real one, and
     this line is what would have caught the two had it been
     pointed at the component the page uses rather than at a
     string.

     `.sample-card` has gone with it. A piece on a hub is the
     `<GoCard>` the front page already drew it with, so what this
     file selects is `[data-kind="go"]`: the card, not the class
     one page's version of it used to carry. */
  ok("the teasers are in the grid too", served.includes('data-kind="soon"'), served.slice(0, 200));
  ok("the subscribe form ships hidden, so a site with no database shows "
    + "the RSS line alone",
    /<form[^>]*id="subscribe-form"[^>]*hidden/.test(served), served);
  ok("and the status line is empty until there is something to say",
    /id="sub-msg"[^>]*><\/p>/.test(served), served);
  ok("nothing on a card carries a topic list for a script to match on",
    !served.includes("data-topics"),
    "the component filtering these has the rows; the attribute was the archived module's");
}

/* ============================================================
   2. The chips, once React has adopted that markup
   ============================================================ */
{
  const { page, errors } = await openPage();

  const chips = () => page.$$eval("#topic-filter .chip", (nodes: Element[]) =>
    nodes.map((n) => `${(n.textContent ?? "").trim()}|${n.getAttribute("aria-pressed")}`));
  const shown = () => page.$$eval('.cards .card[data-kind="go"]',
    (nodes: Element[]) => nodes.filter((n) => !(n as HTMLElement).hidden)
      .map((n) => n.querySelector("h3")?.textContent ?? ""));
  const press = async (label: string): Promise<void> => {
    await page.click(`#topic-filter .chip:has-text("${label}")`);
    await page.waitForTimeout(60);
  };

  ok("the chips are commonest first, and alphabetical inside a tie",
    (await chips()).map((c) => c.split("|")[0]).join(", ")
      === "Everything · 5, Equities · 3, Beginner · 2, Banks · 1, Bonds · 1",
    (await chips()).join(" / "));

  ok("Everything is the one pressed when the page opens",
    (await chips())[0] === "Everything · 5|true", (await chips()).join(" / "));
  ok("and every piece is on the page", (await shown()).length === 5,
    (await shown()).join(", "));

  await press("Equities");

  ok("pressing a chip presses exactly that one",
    (await chips()).filter((c) => c.endsWith("|true")).length === 1,
    (await chips()).join(" / "));
  ok("and it is the one that was pressed",
    (await chips()).includes("Equities · 3|true"), (await chips()).join(" / "));
  ok("Everything is no longer pressed",
    (await chips())[0] === "Everything · 5|false", (await chips()).join(" / "));

  ok("only the pieces carrying that topic are left",
    (await shown()).join(", ")
      === "What DSEX actually measures, Opening a BO account, A treasury bill ladder",
    (await shown()).join(", "));
  ok("a piece filed under no topic at all is hidden by a topic",
    !(await shown()).includes("A piece with no topics"));
  /* `[data-kind="soon"]` rather than a class on the card:
     there were two `SoonCard` exports, this fixture imported the
     one in `cards.tsx` and the hub rendered the one in
     `deck.tsx`, so the selector here described a card the site
     does not draw. */
  ok("and a promised piece is never hidden, because it carries no topic either",
    await page.$eval('[data-kind="soon"]', (n: Element) => !(n as HTMLElement).hidden));

  await press("Bonds");
  ok("a piece filed under two topics comes back under the second one",
    (await shown()).join(", ") === "A treasury bill ladder", (await shown()).join(", "));

  await press("Everything");
  ok("Everything brings all of them back", (await shown()).length === 5,
    (await shown()).join(", "));
  ok("and presses itself", (await chips())[0] === "Everything · 5|true");

  ok("filtering is a way of looking at the page, so nothing navigates",
    new URL(page.url()).pathname === "/", page.url());
  ok("and none of it is React putting the server's markup back",
    mismatches(errors).length === 0, mismatches(errors)[0]);

  await page.close();
}

/* ============================================================
   3. The subscribe box, and the four things it can say
   ============================================================ */

/** What the line under the box says, how it is coloured, whether
    the box is still there, and any link in it. */
const said = (page: Page) => page.$eval("#sub-msg", (n: Element) => ({
  text: (n.textContent ?? "").trim(),
  cls: n.className,
  href: n.querySelector("a")?.getAttribute("href") ?? null,
  html: n.innerHTML,
  gone: (document.querySelector("#subscribe-form") as HTMLElement).hidden,
}));

const send = async (page: Page, address: string): Promise<void> => {
  await page.fill("#sub-email", address);
  await page.click('#subscribe-form button[type="submit"]');
  await page.waitForFunction(() =>
    ((document.querySelector("#sub-msg")?.textContent ?? "").trim()).length > 0
    && (document.querySelector("#sub-msg")?.textContent ?? "") !== "Signing you up…");
};

{
  const { page, errors } = await openPage();

  ok("the box appears once the database has answered",
    (await said(page)).gone === false);
  ok("and it says nothing yet", (await said(page)).text === "");

  await send(page, "reader@example.com");

  const sent = await page.evaluate(() =>
    (window as unknown as { __sent?: Record<string, string> }).__sent);
  ok("the address goes to the endpoint", sent?.email === "reader@example.com",
    JSON.stringify(sent));
  ok("with the honeypot, which the endpoint is the one to read",
    sent !== undefined && "website" in sent, JSON.stringify(sent));
  ok("and where it was signed up from", sent?.source === "insights",
    JSON.stringify(sent));

  ok("the form goes, because the next step is in an inbox",
    (await said(page)).gone === true);
  ok("and the line says to look there",
    (await said(page)).text === "Check your email to confirm.", (await said(page)).text);
  ok("in the site's own ok colour", (await said(page)).cls === "gate-msg mono ok",
    (await said(page)).cls);
  ok("nothing hydrated wrongly on the way", mismatches(errors).length === 0,
    mismatches(errors)[0]);

  await page.close();
}

{
  const { page } = await openPage("window.__reply = { already: true };");
  await send(page, "again@example.com");
  const s = await said(page);
  ok("an address already on the list is told so",
    s.text === "You're already on the list.", s.text);
  ok("and the box stays, because nothing was done", s.gone === false);
  ok("in the ok colour, because it is not a failure", s.cls === "gate-msg mono ok", s.cls);
  await page.close();
}

{
  const { page } = await openPage(
    'window.__reply = { ok: true, confirmUrl: "/api/subscribers/confirm?t=abc" };');
  await send(page, "confirm@example.com");
  const s = await said(page);
  ok("a confirm link comes back as a link", s.href === "/api/subscribers/confirm?t=abc",
    s.href ?? "no link at all");
  ok("with the sentence around it",
    s.text === "Almost: confirm your address to finish.", s.text);
  /* The module wrote this line with `innerHTML`. It is JSX now, so
     the address is escaped by React rather than by whoever
     remembers to: one fewer place on this site where a string
     becomes markup. */
  ok("and the sentence was not built by setting HTML from a string",
    !readFileSync(join(ROOT, "next", "components", "subscribe.tsx"), "utf8")
      .includes("dangerouslySetInnerHTML"), s.html);
  await page.close();
}

{
  const { page } = await openPage("window.__reply = { ok: false, reason: 'nope' };");
  await send(page, "broken@example.com");
  const s = await said(page);
  ok("a refusal names the thing that always works", s.text.includes("RSS feed"), s.text);
  ok("in the error colour", s.cls === "gate-msg mono err", s.cls);
  ok("and the box stays, so it can be tried again", s.gone === false);
  await page.close();
}

{
  const { page } = await openPage("window.__ready = false;");
  await page.waitForTimeout(400);
  const s = await said(page);
  ok("with no database the box never appears", s.gone === true);
  ok("and nothing that looks as though it might work is on the page", s.text === "");
  await page.close();
}

/* ============================================================
   4. And the module it replaced is gone
   ============================================================ */
{
  ok("aab/hub.js is not served any more", !existsSync(join(ROOT, "aab", "hub.js")),
    "two implementations of one filter is the copy CLAUDE.md refuses");
  ok("and it is readable in archive/, which is where a replaced file goes",
    existsSync(join(ROOT, "archive", "modules", "hub.js")));
  ok("no route loads it",
    !readFileSync(join(ROOT, "next", "app", "insights", "layout.tsx"), "utf8")
      .includes("/hub.js"));
  ok("nothing precaches it",
    !readFileSync(join(ROOT, "aab", "sw.js"), "utf8").includes('"/hub.js"'),
    "an install would fetch a 404 and cache it");
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  await fixture.close(1);
}
console.log("The chips filter what is already on the page, the box only\n"
  + "appears when there is somewhere to put an address, and both of\n"
  + "them survive hydration.\n");
await fixture.close(0);
