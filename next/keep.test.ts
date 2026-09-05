/* The Save and the note under a byline, in a browser.
     node next/keep.test.ts
   Needs Playwright and a browser; without either it says which and SKIPS,
   and a skip is not a pass.

   Nine things the row has to do, and a port is finished when it does what
   the thing it replaced did rather than when it renders, so all nine are
   written down below.

   WHY A BROWSER: none of it exists until React has hydrated and two
   effects have run, and both routes that render it are dynamic, so
   `interactive.test.ts` cannot serve either. `hydrate-fixture.ts` is the
   smaller way in and hydrates the component against the server's own
   markup, which is where this shape has gone wrong before.

   AND WHY SUPABASE IS A PLAYWRIGHT ROUTE: `/account.js` and `/saved.js`
   are the REAL modules, served off disk at the addresses the site serves
   them from, because `runtimeModule()` is a real `import()` resolved
   against the page's origin. So the session and the upsert are real and
   the only thing standing in is Postgres: `library` is answered from
   memory, including the trigger that takes a row away once both of its
   facts have gone. What the browser SENT is kept. */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load, open } from "./hydrate-fixture.ts";
import type { BrowserContext, ConsoleMessage, Page, Route } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8792;
const SUPA = "https://wvjarqnnmkkuxyrndtya.supabase.co";
const JS = "text/javascript; charset=utf-8";

/** The two subjects, exactly as the two routes hand them over.
    Both addresses carry `.html`, which is the canonical form and
    the point of the prop: the routes answer at two spellings of
    each and `public.library` is one row per PAGE. */
const PIECE = {
  url: "/insights/dse-basics.html",
  title: "How the DSE works",
  kind: "piece",
} as const;

const LESSON = {
  url: "/money/terms/dsex.html",
  title: "ডিএসইএক্স",
  kind: "lesson",
} as const;

type Subject = typeof PIECE | typeof LESSON;

/* ---------- the server's half, rendered here ---------- */

interface Server {
  renderToString: (node: unknown) => string;
  markup: (props: Subject) => unknown;
}

const { renderToString, markup } = await load<Server>(`
  import { createElement as h } from "react";
  import { Keep } from "./components/keep";
  export { renderToString } from "react-dom/server.browser";
  export const markup = (props) => h("article", { className: "article" },
    h("h1", null, props.title),
    h("p", { className: "byline mono" }, "Rony Reiad"),
    h(Keep, props));
`);

const hydrate = (props: Subject): string => `
  import { createElement as h } from "react";
  import { hydrateRoot } from "react-dom/client";
  import { Keep } from "./components/keep";
  const props = ${JSON.stringify(props)};
  hydrateRoot(document.getElementById("root"),
    h("article", { className: "article" },
      h("h1", null, props.title),
      h("p", { className: "byline mono" }, "Rony Reiad"),
      h(Keep, props)));
`;

const servedPiece = renderToString(markup(PIECE));

/* The two modules the component imports at run time, off disk, at
   the addresses the site serves them from. */
const SERVED_MODULES = {
  "/account.js": { type: JS, body: readFileSync(join(ROOT, "aab", "account.js"), "utf8") },
  "/saved.js": { type: JS, body: readFileSync(join(ROOT, "aab", "saved.js"), "utf8") },
};

const fixture = await open({
  port: PORT,
  body: `<div id="root">${servedPiece}</div>`,
  entry: hydrate(PIECE),
  files: SERVED_MODULES,
});

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};
const is = (what: string, got: unknown, want: unknown): void =>
  ok(what, JSON.stringify(got) === JSON.stringify(want),
    `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

/** React only says a hydration mismatch out loud in development,
    and says it as a numbered error once minified. Both spellings
    are watched, because this bundle is the first and the site's is
    the second. */
const mismatches = (errors: string[]): string[] => errors.filter((e) =>
  /Minified React error #(418|423|425)|did not match|Hydration failed/i.test(e));

/* ---------- a session, and an account with a table in it ---------- */

const b64 = (o: unknown): string => Buffer.from(JSON.stringify(o)).toString("base64url");

/** A token the module can read a reader out of. Nothing verifies
    it and nothing here pretends to: `account.js` says at length
    that reading a JWT is not checking one. */
const jwt = (sub: string): string => [
  b64({ alg: "HS256" }),
  b64({
    sub, email: "i@reiad.co.uk", exp: Math.floor(Date.now() / 1000) + 3600,
    user_metadata: { full_name: "Rony Reiad" },
  }),
  "s",
].join(".");

const session = (sub: string): string => JSON.stringify({
  access_token: jwt(sub), refresh_token: "r", expires_at: Date.now() + 3600e3,
  user: { id: sub, email: "i@reiad.co.uk", name: "Rony Reiad" },
});

/** One row of `public.library`, as PostgREST hands it over. */
interface Row {
  id: string;
  url: string;
  title: string;
  kind: string;
  saved: boolean;
  note: string;
  created_at: string;
  updated_at: string;
}

/** What the browser sent, kept so a check can assert the shape of
    a write rather than only its effect. */
interface Sent {
  method: string;
  body: Array<Record<string, unknown>>;
}

interface Account {
  rows: Row[];
  sent: Sent[];
  /** Every request that reached Supabase at all, which is what
      "signed out, no request" is asserted against. */
  asked: string[];
}

interface Opts {
  /** What the account already holds about this page. */
  rows?: Array<Partial<Row>>;
  signedIn?: boolean;
  /** The read answers 500, which `/saved.js` deliberately reads as
      "nothing there" rather than as an error. */
  readFails?: boolean;
  /** How long the read takes, so the state before it answers is a
      state and not a frame between two paints. */
  readAfter?: number;
  /** What Postgres says when a write is refused. */
  writeFails?: string;
  /** `/saved.js` itself does not load, which is the one way the
      row can fail to appear for a signed-in reader. */
  noModule?: boolean;
}

const row = (patch: Partial<Row>, n = 1): Row => ({
  id: `row-${n}`,
  url: PIECE.url, title: PIECE.title, kind: "piece", saved: false, note: "",
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  ...patch,
});

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "access-control-allow-headers": "*",
};

interface Opened {
  page: Page;
  context: BrowserContext;
  account: Account;
  errors: string[];
}

/**
 * One page, hydrated, against an account holding `rows`.
 *
 * The table is answered rather than mocked: an upsert merges on
 * `(user_id, url)` the way the unique index makes it, and the
 * trigger in the migration removes a row once `saved` is false and
 * `note` is empty, which is what makes the reading list countable.
 */
const openPage = async (o: Opts = {}, at = fixture): Promise<Opened> => {
  const context = await at.browser.newContext();
  const page = await context.newPage();

  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error" && !/favicon|Failed to load resource/i.test(m.text())) {
      errors.push(m.text());
    }
  });

  const account: Account = { rows: (o.rows ?? []).map((r, i) => row(r, i + 1)), sent: [], asked: [] };

  await context.route(`${SUPA}/**`, async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    account.asked.push(`${request.method()} ${url.pathname}`);

    const json = (body: unknown, status = 200): Promise<void> => route.fulfill({
      status, contentType: "application/json", headers: CORS, body: JSON.stringify(body),
    });

    if (request.method() === "OPTIONS") {
      return route.fulfill({ status: 204, headers: CORS, body: "" });
    }
    /* Signing out posts to `auth/v1/logout`, and the module does
       not care what comes back. */
    if (url.pathname.startsWith("/auth/")) return json({});

    if (request.method() === "GET") {
      if (o.readAfter) await new Promise((r) => setTimeout(r, o.readAfter));
      if (o.readFails) return json({ message: "no" }, 500);
      /* `url=eq.<address>`, which is the whole of the filter
         `libraryRow()` sends. */
      const wanted = (url.searchParams.get("url") ?? "").replace(/^eq\./, "");
      return json(account.rows.filter((r) => r.url === wanted));
    }

    const body = JSON.parse(request.postData() ?? "[]") as Array<Record<string, unknown>>;
    account.sent.push({ method: request.method(), body });
    if (o.writeFails) return json({ message: o.writeFails }, 400);

    /* `resolution=merge-duplicates` on `(user_id, url)`: only the
       columns that were sent are changed, which is the whole
       reason one button cannot erase the other's column. */
    const [patch] = body;
    const address = String(patch.url ?? "");
    const was = account.rows.find((r) => r.url === address);
    const base = was ?? row({ url: address }, account.rows.length + 1);
    const merged: Row = {
      ...base,
      title: typeof patch.title === "string" ? patch.title : base.title,
      kind: typeof patch.kind === "string" ? patch.kind : base.kind,
      saved: typeof patch.saved === "boolean" ? patch.saved : base.saved,
      note: typeof patch.note === "string" ? patch.note : base.note,
      updated_at: new Date().toISOString(),
    };
    account.rows = [merged, ...account.rows.filter((r) => r.url !== merged.url)];

    /* The trigger. AFTER UPDATE, so what PostgREST returns is the
       row it wrote and not the row that survived. */
    if (was && merged.saved === false && merged.note === "") {
      account.rows = account.rows.filter((r) => r.url !== merged.url);
    }
    return json([merged], 201);
  });

  if (o.noModule) {
    await context.route(`${at.origin}/saved.js`, (r: Route) => { void r.abort(); });
  }

  if (o.signedIn ?? true) {
    await page.addInitScript((who: string) => {
      localStorage.setItem("reiad-session", who);
    }, session("u-1"));
  }

  await page.goto(at.origin, { waitUntil: "load" });
  return { page, context, account, errors };
};

/* ---------- reading the row off the page ---------- */

const BAR = ".keep-bar";
const KEEP = ".keep-bar .keep-btn >> nth=0";
const NOTE_BTN = ".keep-bar .keep-btn >> nth=1";

interface Drawn {
  keptWord: string;
  keptPressed: string | null;
  keptOn: boolean;
  noteWord: string;
  noteExpanded: string | null;
  noteOn: boolean;
  said: string;
  role: string | null;
  panelHidden: boolean;
}

/** What a page with no row on it reads as. Answered rather than
    thrown for the same reason `shows()` is: a component that
    stops drawing the row should fail with sentences. */
const NOTHING: Drawn = {
  keptWord: "", keptPressed: null, keptOn: false,
  noteWord: "", noteExpanded: null, noteOn: false,
  said: "", role: null, panelHidden: true,
};

const drawn = (page: Page): Promise<Drawn> => page.evaluate(() => {
  const bar = document.querySelector(".keep-bar");
  if (!bar) return null;
  const [keep, note] = [...bar.querySelectorAll(".keep-btn")] as HTMLElement[];
  const said = bar.querySelector(".keep-said");
  const panel = document.querySelector(".keep-panel") as HTMLElement | null;
  return {
    keptWord: keep.querySelector(".keep-word")?.textContent ?? "",
    keptPressed: keep.getAttribute("aria-pressed"),
    keptOn: keep.hasAttribute("data-on"),
    noteWord: note.querySelector(".keep-word")?.textContent ?? "",
    noteExpanded: note.getAttribute("aria-expanded"),
    noteOn: note.hasAttribute("data-on"),
    said: said?.textContent ?? "",
    role: said?.getAttribute("role") ?? null,
    panelHidden: panel === null ? true : panel.hidden !== false,
  };
}).then((d) => d ?? NOTHING);

const settle = (page: Page): Promise<void> => page.waitForTimeout(400);

/** Waited for rather than asserted on the spot, and ANSWERED
    rather than thrown: a row that never turns up is one check
    failing with a sentence, not a timeout with a stack. */
const shows = (page: Page, selector: string,
               state: "visible" | "detached" = "visible"): Promise<boolean> =>
  page.waitForSelector(selector, { state, timeout: 5000 }).then(() => true, () => false);

console.log("the Save and the note under a byline");

/* ============================================================
   1. What the server sends, which is nothing at all
   ============================================================ */
{
  ok("the byline is in the server's HTML", servedPiece.includes('class="byline mono"'),
    servedPiece.slice(0, 200));
  ok("and no Save button beside it", !servedPiece.includes("keep-bar"),
    "what the account says about a page is not a fact the server has");
  ok("nor a note panel", !servedPiece.includes("keep-panel"), servedPiece.slice(0, 400));
  ok("nor a box to type one into", !servedPiece.includes("textarea"),
    servedPiece.slice(0, 400));
  ok("and nothing hidden waiting for a script to unhide it",
    !servedPiece.includes("hidden"),
    "a reader with no account gets the piece, not two dead buttons");
}

/* ============================================================
   2. Signed out, this is not a feature. It is not there.
   ============================================================ */
{
  const { page, context, account, errors } = await openPage({ signedIn: false });
  await settle(page);

  is("no Save button", await page.locator(BAR).count(), 0);
  is("no note panel", await page.locator(".keep-panel").count(), 0);
  ok("not a greyed-out one and not a prompt either",
    !(await page.content()).includes("Sign in"),
    "a reader who has never signed in has no idea this exists");
  is("and the account is never asked about the page", account.asked, []);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   3. Signed in, and nothing is drawn until the account answers

   A Save button that says "Save" for a second and then flips to
   "Kept" is a button that has told the reader something false.
   ============================================================ */
{
  const { page, context, errors } = await openPage({
    rows: [{ saved: true }], readAfter: 1200,
  });

  await page.waitForTimeout(500);
  is("while the account is being asked, there is no row", await page.locator(BAR).count(), 0);

  ok("and then it arrives", await shows(page, BAR));
  is("already right, rather than saying Save and flipping",
    (await drawn(page)).keptWord, "Kept");
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   4. A page this account has never seen
   ============================================================ */
{
  const { page, context, account, errors } = await openPage();
  await page.waitForSelector(BAR);
  const d = await drawn(page);

  is("two buttons and a line", await page.locator(".keep-bar .keep-btn").count(), 2);
  is("the first offers to keep it", d.keptWord, "Save");
  is("and says it is a toggle that is off", d.keptPressed, "false");
  is("with nothing lit", d.keptOn, false);
  is("the second offers a note", d.noteWord, "Add a note");
  is("and says the panel is shut", d.noteExpanded, "false");
  is("which it is", d.panelHidden, true);
  is("the line is announced rather than only shown", d.role, "status");
  is("and says nothing yet, so it is not read out on load", d.said, "");

  is("the account was asked about this page once",
    account.asked.filter((a) => a.startsWith("GET")).length, 1);
  is("nothing was written by drawing it",
    account.sent.map((s) => s.method), []);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   5. Saving, which writes one row and does not touch the note
   ============================================================ */
{
  const { page, context, account, errors } = await openPage();
  await page.waitForSelector(BAR);

  await page.click(KEEP);
  await settle(page);

  is("pressing Save writes to the library once", account.sent.length, 1);
  const [wrote] = account.sent[0].body;
  is("under the address the ROUTE gave it, not the one the browser is at",
    wrote.url, PIECE.url);
  is("with the title", wrote.title, PIECE.title);
  is("as a piece", wrote.kind, "piece");
  is("and saved", wrote.saved, true);
  /* The reader may have written a note on their phone this
     morning, and a Save that sent `note: ""` would erase it. */
  is("and it does not touch the note", "note" in wrote, false);

  const d = await drawn(page);
  is("the button says so", d.keptWord, "Kept");
  is("as a pressed toggle", d.keptPressed, "true");
  is("and is lit, so the state is legible without reading the word", d.keptOn, true);
  is("the line says where it went", d.said, "Kept. It is on your reading list.");
  is("and the account holds exactly one row for the page",
    account.rows.filter((r) => r.url === PIECE.url).length, 1);

  /* The line is a message and not a label: it goes away. */
  await page.waitForTimeout(2800);
  is("and then stops saying it", (await drawn(page)).said, "");
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   6. Unsaving, and the row that takes itself away with it
   ============================================================ */
{
  const { page, context, account, errors } = await openPage({ rows: [{ saved: true }] });
  await page.waitForSelector(BAR);
  is("a page already kept says so on arrival", (await drawn(page)).keptWord, "Kept");

  await page.click(KEEP);
  await settle(page);

  is("pressing it again writes saved: false", account.sent[0].body[0].saved, false);
  const d = await drawn(page);
  is("the button offers to keep it again", d.keptWord, "Save");
  is("unpressed", d.keptPressed, "false");
  is("and unlit", d.keptOn, false);
  is("the line says what happened", d.said, "Taken off your list.");
  /* The trigger, and the reason the reading list can be COUNTED
     rather than filtered. */
  is("and the row is gone from the account rather than sitting there empty",
    account.rows.filter((r) => r.url === PIECE.url).length, 0);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   7. The note, which is the same row's other column
   ============================================================ */
{
  const { page, context, account, errors } = await openPage();
  await page.waitForSelector(BAR);

  is("the panel ships shut", (await drawn(page)).panelHidden, true);
  await page.click(NOTE_BTN);
  await settle(page);

  const opened = await drawn(page);
  is("pressing the second button opens it", opened.panelHidden, false);
  is("and the button says so", opened.noteExpanded, "true");
  is("the box is where the caret already is",
    await page.evaluate(() => document.activeElement?.tagName), "TEXTAREA");

  const box = page.locator(".keep-note");
  is("it says who can read it",
    await box.getAttribute("placeholder"),
    "For your eyes only. Nobody else can read this.");
  is("it is announced, without a label taking up the margin",
    await page.locator("label[for='keep-note']").textContent(), "Your note on this page");
  is("and the label is read rather than drawn",
    await page.locator("label[for='keep-note']").evaluate(
      (n: Element) => n.className.includes("sr-only")), true);
  is("it stops where the column does", await box.getAttribute("maxlength"), "20000");

  await box.fill("Worth rereading. <b>Twice</b>.");
  await page.click(".keep-panel .btn-solid");
  await settle(page);

  const [wrote] = account.sent[0].body;
  is("saving the note writes it", wrote.note, "Worth rereading. <b>Twice</b>.");
  is("on the same row, under the same address", wrote.url, PIECE.url);
  /* The other half of the rule the Save follows. */
  is("and it does not touch the save", "saved" in wrote, false);

  const d = await drawn(page);
  is("the button says there is one now", d.noteWord, "Your note");
  is("and is lit", d.noteOn, true);
  is("the line under the box says it went", d.said, "");
  is("the panel's own line says it", await page.locator(".keep-panel .keep-said").textContent(),
    "Saved.");
  is("and the account holds one row, not two",
    account.rows.filter((r) => r.url === PIECE.url).length, 1);
  is("with both facts on it",
    account.rows.map((r) => [r.note, r.saved]),
    [["Worth rereading. <b>Twice</b>.", false]]);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   8. A note that is already there, and emptying the box
   ============================================================ */
{
  const { page, context, account, errors } = await openPage({
    rows: [{ saved: true, note: "Read the second half again." }],
  });
  await page.waitForSelector(BAR);

  const d = await drawn(page);
  is("a page with a note on it says so before anything is pressed", d.noteWord, "Your note");
  is("and so does the Save", d.keptWord, "Kept");

  await page.click(NOTE_BTN);
  await settle(page);
  is("the note is in the box, as the reader typed it",
    await page.locator(".keep-note").inputValue(), "Read the second half again.");

  await page.locator(".keep-note").fill("   ");
  await page.click(".keep-panel .btn-solid");
  await settle(page);

  is("emptying the box is how a note is deleted", account.sent[0]?.body[0].note, "");
  is("and it says so rather than silently keeping an empty one",
    await page.locator(".keep-panel .keep-said").textContent(), "Note removed.");
  is("the button offers a new one", (await drawn(page)).noteWord, "Add a note");
  is("the page is still kept, because that is the other column",
    (await drawn(page)).keptWord, "Kept");
  is("and the row survives, because one of its two facts is still true",
    account.rows.filter((r) => r.url === PIECE.url).length, 1);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   9. Unsaving a page you wrote on keeps what you wrote

   The whole of "one row, two facts". Taking a page off the
   reading list must not take the note with it, and the row must
   not be removed either, because it is not empty.
   ============================================================ */
{
  const { page, context, account, errors } = await openPage({
    rows: [{ saved: true, note: "The bit about circuit breakers." }],
  });
  await page.waitForSelector(BAR);

  await page.click(KEEP);
  await settle(page);

  const d = await drawn(page);
  is("the page comes off the list", d.keptWord, "Save");
  is("and the note is still there", d.noteWord, "Your note");
  is("still lit", d.noteOn, true);
  is("the row stays, because it is not empty",
    account.rows.filter((r) => r.url === PIECE.url).length, 1);
  is("with the note untouched", account.rows.map((r) => r.note),
    ["The bit about circuit breakers."]);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   10. When it does not save, it says so
   ============================================================ */
{
  const { page, context, errors } = await openPage({
    writeFails: "new row violates check constraint",
  });
  await page.waitForSelector(BAR);

  await page.click(KEEP);
  await settle(page);

  is("Postgres's own sentence is the one the reader is shown",
    (await drawn(page)).said, "new row violates check constraint");
  is("and the button does not claim it worked", (await drawn(page)).keptWord, "Save");
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   11. And when the account cannot be reached at all

   Two different failures with two different right answers, and
   `/saved.js` is where the difference is decided: a READ answers
   with a fallback so a list can render empty, and a page nobody
   has kept is exactly what an empty answer means. The module not
   loading is the other one, and then there is nothing to draw.
   ============================================================ */
{
  const { page, context, errors } = await openPage({ readFails: true });
  ok("a read that fails still draws the row", await shows(page, BAR));
  is("as a page nobody has kept",
    (await drawn(page)).keptWord, "Save");
  is("which is what an empty answer means, and it is not an error",
    mismatches(errors), []);
  await context.close();
}

{
  const { page, context, errors } = await openPage({ noModule: true });
  await page.waitForTimeout(1500);
  is("with /saved.js unreachable there is no row at all",
    await page.locator(BAR).count(), 0);
  ok("because an unusable control is worse than none: a reader presses it",
    (await page.locator(".keep-panel").count()) === 0);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

/* ============================================================
   12. Signing in on the page you are reading, and out again

   Both through the real `/account.js`: coming back from Supabase
   with the tokens in the fragment is what `initAccount()` reads,
   and `signOut()` is the other end of it. Neither reloads.
   ============================================================ */
{
  const { page, context, account, errors } = await openPage({
    signedIn: false, rows: [{ saved: true }],
  });
  await settle(page);
  is("signed out, no row", await page.locator(BAR).count(), 0);

  await page.evaluate(async (token: string) => {
    location.hash = `access_token=${token}&refresh_token=r&expires_in=3600`;
    const account = await import("/account.js");
    account.initAccount();
  }, jwt("u-1"));

  ok("signing in puts the row on the page you are already reading",
    await shows(page, BAR), "the account:changed listener is what carries this");
  is("saying what the account already held about it",
    (await drawn(page)).keptWord, "Kept");
  ok("and it asked the account about this page only once it had one",
    account.asked.filter((a) => a.startsWith("GET")).length === 1,
    account.asked.join(", "));

  await page.evaluate(async () => {
    const account = await import("/account.js");
    await account.signOut();
  });
  ok("and signing out takes it away, so the next person at this "
    + "machine does not inherit it", await shows(page, BAR, "detached"));
  is("the note panel goes with it", await page.locator(".keep-panel").count(), 0);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
}

await fixture.stop();

/* ============================================================
   13. The same row on a lesson, which is the other route
   ============================================================ */
{
  const servedLesson = renderToString(markup(LESSON));
  const lessons = await open({
    port: PORT + 1,
    body: `<div id="root">${servedLesson}</div>`,
    entry: hydrate(LESSON),
    files: SERVED_MODULES,
  });

  ok("the server sends none of it here either", !servedLesson.includes("keep-bar"),
    servedLesson.slice(0, 300));

  const { page, context, account, errors } = await openPage({}, lessons);
  await page.waitForSelector(BAR);
  is("the same two buttons a piece has, so a reader learns them once",
    await page.locator(".keep-bar .keep-btn").count(), 2);

  await page.click(KEEP);
  await settle(page);

  const [wrote] = account.sent[0].body;
  is("kept as a lesson", wrote.kind, "lesson");
  is("under the lesson's own address", wrote.url, LESSON.url);
  is("and under its Bangla title rather than the heading, which "
    + "carries an icon and a second language", wrote.title, LESSON.title);
  is("nothing hydrated wrongly", mismatches(errors), []);
  await context.close();
  await lessons.stop();
}

/* ============================================================
   14. And the module it replaced is gone
   ============================================================ */
{
  ok("aab/keep.js is not served any more", !existsSync(join(ROOT, "aab", "keep.js")),
    "two Save buttons is the copy CLAUDE.md refuses");
  ok("nor is its source", !existsSync(join(ROOT, "aab", "src", "keep.ts")));
  ok("both are readable in archive/, which is where a replaced file goes",
    existsSync(join(ROOT, "archive", "modules", "keep.js"))
    && existsSync(join(ROOT, "archive", "modules", "keep.ts")));
  ok("build-modules.ts does not build it",
    !readFileSync(join(ROOT, "scripts", "build-modules.ts"), "utf8").includes('"keep"'));
  ok("and the declaration it emitted is gone with it",
    !existsSync(join(ROOT, "app", "src", "types", "keep.d.ts")),
    "a module that describes nothing is a description that drifts");

  /* Neither route loads it, and neither has a SiteScripts entry
     left where it was. `check-sw.ts` is what holds the precache
     list to files that exist, so it is not said twice here. */
  for (const route of [
    join(ROOT, "next", "app", "[section]", "[slug]", "page.tsx"),
    join(ROOT, "next", "app", "[section]", "[slug]", "[lesson]", "page.tsx"),
  ]) {
    ok(`${route.split("/").slice(-3).join("/")} does not load it`,
      !readFileSync(route, "utf8").includes("keep.js"));
  }
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
console.log("Nothing signed out, nothing until the account answers, one row\n"
  + "with two facts on it, and neither control touching the other's.\n");
process.exit(0);
