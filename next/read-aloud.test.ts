/* ============================================================
   read-aloud.test.ts: the speech control on a piece, in a browser.

     node next/read-aloud.test.ts

   Needs Playwright and a browser. Without either it says which and
   skips, and a skip is not a pass.

   `archive/modules/read-aloud.js` was 150 lines and it is
   `components/read-aloud.tsx` now. A port is finished when it does
   what the thing it replaced did, not when it renders, so what
   that module did is written down here: which paragraphs it reads
   and which it steps over, what language, voice and speed it
   picks, what it marks while it is speaking, and the ways it
   stops.

   ---- why the synthesiser is a stub ----

   `speechSynthesis` in a headless browser has no voices and speaks
   nothing, so every check below would pass on a page that never
   said a word. `SYNTH` replaces it before any script runs, gives
   it voices to choose between, and RECORDS what it was asked to
   say. Everything asserted here is read off that record, which is
   the only place the answers exist.

   It is also what makes the last check possible. Stop is the one
   thing the module did not do: `synth.cancel()` ended the sentence
   and the loop then spoke the next one, because the only thing
   that would have broken it was `window.canceledByUser`, which
   nothing on this site has ever set. Nothing can see that without
   watching what is spoken after the press.
   ============================================================ */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load, open, type Fixture } from "./hydrate-fixture.ts";
import type { ConsoleMessage, Page } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8994;

/* An article body of the shape the Studio writes, with one of
   everything the control has an opinion about: headings and list
   items, which are read; a paragraph of one character and an empty
   one, which a synthesiser reads as a noise. */
const BODY = [
  "<h2>The first heading</h2>",
  "<p>A first paragraph about the market.</p>",
  "<ul><li>A list item worth hearing</li><li>·</li></ul>",
  "<p></p>",
  "<h3>The second heading</h3>",
  "<p>A last paragraph, and then the furniture.</p>",
].join("");

const BANGLA_BODY = "<p>এটি বাংলায় লেখা একটি অনুচ্ছেদ।</p>";

/** Everything spoken, in order, in this run. */
const READS = [
  "What DSEX actually measures",
  "The index, plainly.",
  "The first heading",
  "A first paragraph about the market.",
  "A list item worth hearing",
  "The second heading",
  "A last paragraph, and then the furniture.",
];

/* ---------- the page, rendered here and hydrated there ---------- */

/* The article route's own shape, down to the furniture: the byline
   the toolbar is inserted under, and the four blocks that are on
   the page and are not the piece. Each of the four holds a
   paragraph, because a `div.note` on its own is not matched by the
   selector at all and would prove nothing about the skip list. */
const PAGE = `
  import { createElement as h } from "react";
  import { ReadAloud } from "./components/read-aloud";
  export const markup = (body) => h("main", { id: "main" },
    h("article", { className: "wrap article", "data-slug": "a-piece" },
      h("span", { className: "eyebrow mono" }, "Explainer"),
      h("h1", null, "What DSEX actually measures"),
      h("p", { className: "lede" }, "The index, plainly."),
      h("p", { className: "byline mono" }, "Rony Reiad"),
      h(ReadAloud, null),
      h("div", { dangerouslySetInnerHTML: { __html: body } }),
      h("div", { className: "note" }, h("p", null, "This is not investment advice.")),
      h("div", { className: "react-row" }, h("p", null, "Was this useful?")),
      h("ul", { className: "qa-list" }, h("li", null, "A question somebody asked")),
      h("div", { className: "prev-next" },
        h("p", null, "Read next"),
        h("a", { href: "/insights" }, "Back to Insights"))));
`;

interface Server {
  renderToString: (node: unknown) => string;
  markup: (body: string) => unknown;
}

const { renderToString, markup } = await load<Server>(
  `${PAGE}\nexport { renderToString } from "react-dom/server.browser";`);

/* A synthesiser that keeps what it was handed, in order, with the
   three facts a caller sets on an utterance, and fires the events
   a real one fires so that the component's own sequencing is what
   is under test. It answers on a timer rather than at once,
   because the thing being checked is a QUEUE: an implementation
   that spoke everything synchronously would pass a test that never
   waited.

   `__marks` and `__maxMarks` are the other half. A highlight comes
   and goes between two utterances, so counting them at a moment of
   Playwright's choosing is a race; an observer sees every state the
   page passes through. */
const SYNTH = `
  (() => {
    const spoken = [];
    let queue = [];
    let timer = null;
    let current = null;
    const voices = [
      { name: "Amy", lang: "en-GB" },
      { name: "Bina", lang: "bn-IN" },
      { name: "Joanna", lang: "en-US" },
    ];
    const step = () => {
      timer = null;
      current = queue.shift() || null;
      if (!current) { synth.speaking = false; synth.pending = false; return; }
      const u = current;
      synth.speaking = true;
      synth.pending = queue.length > 0;
      spoken.push({ text: u.text, lang: u.lang, rate: u.rate,
                    voice: u.voice ? u.voice.name : null });
      if (u.onstart) u.onstart({});
      timer = setTimeout(() => {
        current = null;
        if (u.onend) u.onend({});
        step();
      }, 30);
    };
    const synth = {
      speaking: false,
      pending: false,
      paused: false,
      getVoices: () => voices,
      addEventListener() {},
      removeEventListener() {},
      speak(u) {
        queue.push(u);
        if (!timer) timer = setTimeout(step, 0);
      },
      cancel() {
        queue = [];
        clearTimeout(timer);
        timer = null;
        synth.speaking = false;
        synth.pending = false;
        window.__cancels = (window.__cancels || 0) + 1;
        /* A real cancel ends the utterance it interrupted, which
           is exactly what let the module's loop walk on to the
           next paragraph. Firing it is what makes that reachable. */
        const u = current;
        current = null;
        if (u && u.onend) u.onend({});
      },
    };
    Object.defineProperty(window, "speechSynthesis",
      { value: synth, configurable: true });
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text; this.lang = ""; this.rate = 1; this.voice = null;
      this.onstart = null; this.onend = null; this.onerror = null;
    };
    window.__spoken = spoken;

    window.__scrolled = [];
    Element.prototype.scrollIntoView = function () {
      window.__scrolled.push((this.textContent || "").trim().slice(0, 30));
    };

    window.__marks = [];
    window.__maxMarks = 0;
    new MutationObserver(() => {
      const marked = [...document.querySelectorAll(".read-aloud-highlight")];
      if (marked.length > window.__maxMarks) window.__maxMarks = marked.length;
      if (marked.length === 1) {
        const text = (marked[0].textContent || "").trim();
        if (window.__marks[window.__marks.length - 1] !== text) window.__marks.push(text);
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ["class"] });
  })();
`;

/* A browser that cannot speak at all, which was the module's first
   line and is the reason this component renders nothing until it
   has run. `speechSynthesis` lives on `Window.prototype`, so
   deleting it off `window` leaves `"speechSynthesis" in window`
   true and the whole check pointing at undefined. */
const NO_SYNTH = `
  for (let o = window; o; o = Object.getPrototypeOf(o)) {
    if (Object.prototype.hasOwnProperty.call(o, "speechSynthesis")) {
      delete o.speechSynthesis;
    }
  }
`;

const served = renderToString(markup(BODY));

const page = (body: string, html: string): { body: string; entry: string } => ({
  body: `<div id="root">${html}</div>`
    + `<script type="application/json" id="body">${JSON.stringify(body)}</script>`,
  entry: `
    import { hydrateRoot } from "react-dom/client";
    ${PAGE}
    hydrateRoot(document.getElementById("root"),
      markup(JSON.parse(document.getElementById("body").textContent)));
  `,
});

const fixture = await open({ port: PORT, ...page(BODY, served) });

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};

interface Said {
  text: string;
  lang: string;
  rate: number;
  voice: string | null;
}

const spoken = (p: Page): Promise<Said[]> =>
  p.evaluate(() => (window as unknown as { __spoken: Said[] }).__spoken);

const cancels = (p: Page): Promise<number> =>
  p.evaluate(() => (window as unknown as { __cancels?: number }).__cancels ?? 0);

const mismatches = (errors: string[]): string[] => errors.filter((e) =>
  /Minified React error #(418|423|425)|did not match|Hydration failed/i.test(e));

/** One page, hydrated, with the stub in it unless told otherwise. */
const openPage = async (where: Fixture, before = SYNTH, toolbar = true):
Promise<{ page: Page; errors: string[] }> => {
  const p = await where.browser.newPage();
  const errors: string[] = [];
  p.on("pageerror", (e: Error) => errors.push(e.message));
  p.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error" && !/favicon|Failed to load resource/i.test(m.text())) {
      errors.push(m.text());
    }
  });
  await p.addInitScript(before);
  await p.goto(where.origin, { waitUntil: "load" });
  /* The toolbar is rendered by an effect, so it appearing is what
     says React has hydrated. Nothing below guesses at a timeout. */
  if (toolbar) await p.waitForSelector(".read-aloud-toolbar");
  else await p.waitForTimeout(500);
  return { page: p, errors };
};

/** Wait until at least `n` things have been spoken. */
const heard = (p: Page, n: number): Promise<unknown> =>
  p.waitForFunction((want: number) =>
    (window as unknown as { __spoken: unknown[] }).__spoken.length >= want, n);

/** Press the button from inside the page and report what had been
    spoken at the moment of the press. Reading the count from here
    and then clicking is a race: the queue moves every 30ms. */
const pressAndCount = (p: Page): Promise<number> => p.evaluate(() => {
  (document.querySelector(".read-aloud-toolbar button") as HTMLElement).click();
  return (window as unknown as { __spoken: unknown[] }).__spoken.length;
});

console.log("the speech control on a piece");

/* ============================================================
   1. What the server sends, which is nothing
   ============================================================ */
{
  ok("the toolbar is not in the server's HTML",
    !served.includes("read-aloud-toolbar"),
    "whether a browser can speak is not a fact the server has");
  ok("nor a stylesheet appended to the head for it",
    !served.includes("read-aloud-highlight"),
    "a node a script adds before hydration is a node React removes");
  ok("and the piece itself is all there without it",
    served.includes("A first paragraph about the market."));
}

/* ============================================================
   2. A browser that cannot speak gets nothing at all
   ============================================================ */
{
  const { page: p, errors } = await openPage(fixture, NO_SYNTH, false);
  ok("no speechSynthesis, no toolbar", await p.$(".read-aloud-toolbar") === null,
    "a dead button is worse than no button");
  ok("and nothing threw on the way to deciding that", errors.length === 0, errors[0]);
  await p.close();
}

/* ============================================================
   3. The toolbar, where it goes and what is in it
   ============================================================ */
{
  const { page: p, errors } = await openPage(fixture);

  ok("the toolbar sits under the byline, where the module put it",
    await p.$eval(".read-aloud-toolbar",
      (n: Element) => n.previousElementSibling?.className ?? "") === "byline mono");
  ok("and inside the article, so it travels with the piece",
    await p.$eval(".read-aloud-toolbar",
      (n: Element) => n.closest("article")?.getAttribute("data-slug")) === "a-piece");

  ok("the button offers to read",
    (await p.textContent(".read-aloud-toolbar button"))?.includes("Read aloud"),
    await p.textContent(".read-aloud-toolbar button") ?? "");
  ok("and it is a real button rather than a link",
    await p.$eval(".read-aloud-toolbar button",
      (n: Element) => `${n.tagName}:${n.getAttribute("type")}`) === "BUTTON:button");

  /* THE SPEED IS NOT THERE UNTIL IT IS SPEAKING, and that is the
     point of asserting its absence first. It used to sit on the
     row between the byline and the first sentence of every piece,
     which is a control a reader has to look past to start reading
     and cannot yet have an opinion about: nobody knows a voice is
     too fast until they have heard it. */
  ok("the speed is not offered before there is a voice to slow down",
    (await p.$('.read-aloud-toolbar input[type="range"]')) === null);

  await p.click(".read-aloud-toolbar button");
  await p.waitForSelector('.read-aloud-toolbar input[type="range"]');
  const slider = await p.$eval('.read-aloud-toolbar input[type="range"]', (n: Element) => ({
    min: n.getAttribute("min"), max: n.getAttribute("max"),
    step: n.getAttribute("step"), value: (n as HTMLInputElement).value,
    title: n.getAttribute("title"),
    labelled: n.closest("label")?.textContent?.includes("Speed") ?? false,
  }));
  ok("the speed runs from 0.7 to 1.4 in tenths, starting at 1",
    slider.min === "0.7" && slider.max === "1.4" && slider.step === "0.1"
    && slider.value === "1", JSON.stringify(slider));
  ok("it says what it is for", slider.title === "Speech rate");
  ok("and the label is its own, so the word is part of the control", slider.labelled);

  ok("nothing hydrated wrongly", mismatches(errors).length === 0, mismatches(errors)[0]);
  await p.close();
}

/* ============================================================
   4. What it reads, and what it steps over
   ============================================================ */
{
  const { page: p } = await openPage(fixture);
  await p.click(".read-aloud-toolbar button");
  await heard(p, READS.length);
  await p.waitForTimeout(150);

  const said = (await spoken(p)).map((s) => s.text);

  ok("it reads the piece in the order it is written",
    said.join(" | ") === READS.join(" | "), said.join(" | "));
  ok("the byline is not read out, because the button sits beside it",
    !said.some((t) => t.includes("Rony Reiad")));
  ok("nor the note every piece carries",
    !said.some((t) => t.includes("not investment advice")));
  ok("nor the reactions row", !said.includes("Was this useful?"));
  ok("nor the questions under it", !said.includes("A question somebody asked"));
  ok("nor the prev/next pair at the foot", !said.includes("Read next"));
  ok("nor the words on its own buttons",
    !said.some((t) => t.includes("Read aloud") || t.includes("Speed")));
  ok("an empty paragraph is skipped rather than spoken as silence", !said.includes(""));
  ok("and a one-character list item is skipped too", !said.includes("·"));
  ok("nothing is spoken twice", new Set(said).size === said.length, said.join(" | "));

  await p.close();
}

/* ============================================================
   5. Language, voice and speed
   ============================================================ */
{
  const { page: p } = await openPage(fixture);
  await p.click(".read-aloud-toolbar button");
  await heard(p, 1);
  const first = (await spoken(p))[0];
  ok("an English piece is read in English", first.lang === "en-GB", first.lang);
  ok("in a voice this machine has for it", first.voice === "Amy", first.voice ?? "none");
  ok("at the speed the slider is set to", first.rate === 1, String(first.rate));
  await p.close();
}

{
  const { page: p } = await openPage(fixture);
  /* THE READER'S ROUTE TO THE SLIDER, which is the only one there
     is now: press, hear that it is too fast, slow it down, and go
     again. The setting survives the stop because `rate` is state
     on the component and only its markup goes away. */
  await p.click(".read-aloud-toolbar button");
  await heard(p, 1);
  await p.waitForSelector('.read-aloud-toolbar input[type="range"]');
  /* The slider is a controlled input, so it has to be moved the
     way a reader moves it rather than by assigning `value`. */
  await p.$eval('.read-aloud-toolbar input[type="range"]', (n: Element) => {
    const input = n as HTMLInputElement;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
      ?.set?.call(input, "1.4");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await p.click(".read-aloud-toolbar button");       // stop
  const from = await pressAndCount(p);               // and go again
  await heard(p, from + 1);
  ok("moving the slider moves the speed", (await spoken(p))[from].rate === 1.4,
    String((await spoken(p))[from].rate));
  ok("and the setting outlives the stop that hid the slider",
    (await p.$eval('.read-aloud-toolbar input[type="range"]',
      (n: Element) => (n as HTMLInputElement).value)) === "1.4");
  await p.close();
}

/* ============================================================
   6. What it marks while it is speaking
   ============================================================ */
{
  const { page: p } = await openPage(fixture);
  await p.click(".read-aloud-toolbar button");
  await heard(p, READS.length);
  await p.waitForTimeout(150);

  const seen = await p.evaluate(() => {
    const w = window as unknown as
      { __marks: string[]; __maxMarks: number; __scrolled: string[] };
    return { marks: w.__marks, most: w.__maxMarks, scrolled: w.__scrolled };
  });
  ok("every paragraph is marked as it is spoken, and in that order",
    seen.marks.join(" | ") === READS.join(" | "), seen.marks.join(" | "));
  ok("never two at once", seen.most === 1, String(seen.most));
  ok("and each one is scrolled to, so a long piece follows itself",
    seen.scrolled.join(" | ") === READS.map((t) => t.slice(0, 30)).join(" | "),
    seen.scrolled.join(" | "));

  ok("nothing is left marked when the piece is finished",
    (await p.$$(".read-aloud-highlight")).length === 0);
  ok("and the button offers to read it again",
    (await p.textContent(".read-aloud-toolbar button"))?.includes("Read aloud"));

  await p.close();
}

/* ============================================================
   7. Stopping, which is the thing the module did not do
   ============================================================ */
{
  const { page: p } = await openPage(fixture);
  await p.click(".read-aloud-toolbar button");
  await heard(p, 2);

  ok("while it is speaking the button offers to stop",
    (await p.textContent(".read-aloud-toolbar button"))?.includes("Stop"),
    await p.textContent(".read-aloud-toolbar button") ?? "");

  const atPress = await pressAndCount(p);
  await p.waitForTimeout(300);

  ok("pressing Stop cancels the synthesiser", await cancels(p) === 1);
  /* THE ONE THE MODULE GOT WRONG, and it is why this file drives a
     browser rather than reading the component. */
  ok("and nothing is spoken after it", (await spoken(p)).length === atPress,
    `${(await spoken(p)).length} spoken, ${atPress} when Stop was pressed`);
  ok("nothing is left marked", (await p.$$(".read-aloud-highlight")).length === 0);
  ok("and the button offers to read again",
    (await p.textContent(".read-aloud-toolbar button"))?.includes("Read aloud"));

  await p.click(".read-aloud-toolbar button");
  await heard(p, atPress + 1);
  ok("pressing it again starts from the top",
    (await spoken(p))[atPress].text === READS[0], (await spoken(p))[atPress].text);
  await p.close();
}

{
  const { page: p } = await openPage(fixture);
  await p.click(".read-aloud-toolbar button");
  await heard(p, 2);
  /* A tab left speaking in the background is the one thing here
     somebody would have to go and hunt for. */
  const atHide = await p.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    return (window as unknown as { __spoken: unknown[] }).__spoken.length;
  });
  await p.waitForTimeout(300);
  ok("hiding the tab stops it", await cancels(p) === 1);
  ok("and nothing carries on in the background", (await spoken(p)).length === atHide,
    `${(await spoken(p)).length} spoken, ${atHide} when it was hidden`);
  await p.close();
}

{
  const { page: p } = await openPage(fixture);
  await p.click(".read-aloud-toolbar button");
  await heard(p, 2);
  const atLeave = await p.evaluate(() => {
    window.dispatchEvent(new Event("pagehide"));
    return (window as unknown as { __spoken: unknown[] }).__spoken.length;
  });
  await p.waitForTimeout(300);
  ok("leaving the page stops it", await cancels(p) === 1);
  ok("and nothing is spoken on the way out", (await spoken(p)).length === atLeave,
    `${(await spoken(p)).length} spoken, ${atLeave} when it was left`);
  await p.close();
}

/* ============================================================
   8. A Bangla piece, which is the other half of the one thing
      the module read the whole article's text for
   ============================================================ */
{
  const bn = await open({
    port: PORT + 1,
    ...page(BANGLA_BODY, renderToString(markup(BANGLA_BODY))),
  });
  const { page: p } = await openPage(bn);
  await p.click(".read-aloud-toolbar button");
  await heard(p, 3);

  const said = await spoken(p);
  ok("one Bangla paragraph makes the whole piece a Bangla read",
    said.every((s) => s.lang === "bn-BD"), said[0].lang);
  ok("and the nearest voice is taken, region and all",
    said[0].voice === "Bina", said[0].voice ?? "none");
  ok("the Bangla itself is what gets spoken",
    said.some((s) => /[ঀ-৾]/.test(s.text)), said.map((s) => s.text).join(" | "));

  await p.close();
  await bn.stop();
}

/* ============================================================
   9. And the module it replaced is gone
   ============================================================ */
{
  ok("aab/read-aloud.js is not served any more",
    !existsSync(join(ROOT, "aab", "read-aloud.js")),
    "two speech controls is the copy CLAUDE.md refuses");
  ok("and it is readable in archive/, which is where a replaced file goes",
    existsSync(join(ROOT, "archive", "modules", "read-aloud.js")));

  ok("the article layout does not load it",
    !readFileSync(join(ROOT, "next", "app", "[section]", "[slug]", "layout.tsx"), "utf8")
      .includes("read-aloud.js"));
  /* The Worker's own renderer answers only when the service
     binding to the Next Worker is gone, and it cannot mount a
     component. A `<script>` tag left there would fetch a 404 on
     exactly the path that is already the degraded one. */
  /* `.ts`, and it has been since `functions/` was converted. This
     line still named the `.js` and had been throwing ENOENT on
     every run since, which takes the whole file with it: nine
     sections of speech control assertions that nobody had seen
     the result of. `check-pointers.ts` looks for `check-*`,
     `build-*` and `*.test.*` names and would not have caught a
     route file. */
  ok("nor does the Worker's fallback renderer",
    !/<script[^>]*src="\/read-aloud\.js"/
      .test(readFileSync(join(ROOT, "functions", "insights", "[slug].ts"), "utf8")));
  /* The manifest rather than `sw.js` itself: that file's changelog
     NAMES every module a version retired, which is the whole point
     of it, so grepping the source made a correct changelog entry
     fail this check. `sw-manifest.json` is the list that is
     actually fetched on install. */
  const precached = Object.keys(
    (JSON.parse(readFileSync(join(ROOT, "aab", "sw-manifest.json"), "utf8")) as
      { hashes: Record<string, string> }).hashes);
  ok("nothing precaches it",
    !precached.some((path) => path.includes("read-aloud")),
    "an install would fetch a 404 and cache it");

  const component = readFileSync(
    join(ROOT, "next", "components", "read-aloud.tsx"), "utf8");
  ok("and the component appends no stylesheet of its own",
    !component.includes("document.head"),
    "a <style> a script adds before hydration is a node React removes");
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  await fixture.close(1);
}
console.log("It reads the piece and not the furniture, marks where it is,\n"
  + "and Stop stops, which is more than the module it replaced did.\n");
await fixture.close(0);
