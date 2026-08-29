/* ============================================================
   widgets.test.ts: the board a reader arranges.

       node scripts/widgets.test.ts

   The catalogue is data and the drawing is code, which means the
   two sides of this will be at different versions for as long as
   there is an app: a phone installed in March reading a
   catalogue deployed in August, and a browser on the current
   build reading a layout that a newer phone wrote.

   Every assertion here is one of those crossings. None of them
   is about how a widget LOOKS, because none of them can be: what
   goes wrong across a version boundary is a list being parsed,
   and that is arithmetic.
   ============================================================ */

import {
  WIDGETS, HOME_DEFAULT, layoutOf, parsePlaced, storedOf,
} from "../shared/widgets.ts";

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};
const is = (what: string, got: unknown, want: unknown): void =>
  ok(what, JSON.stringify(got) === JSON.stringify(want),
    `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

const ids = WIDGETS.map((w) => w.id);
const all = new Set(ids);

/* ------------------------------------------------------------
   1. The catalogue itself
   ------------------------------------------------------------ */

is("every id is unique", ids.length, new Set(ids).size);

for (const kind of WIDGETS) {
  ok(`${kind.id} is said in both languages`,
    kind.bn.trim() && kind.en.trim(),
    "A Bangla reader should never have to read English to find out that "
    + "something exists in their own language.");
  ok(`${kind.id} says what it shows`, kind.note.trim().length > 10,
    "The note is what a reader reads in the picker BEFORE adding it, so it "
    + "has to say what they will see rather than repeat the name.");
  ok(`${kind.id} offers a size`, kind.sizes.length > 0);
  ok(`${kind.id} names an icon`, kind.icon.trim().length > 0);
}

/* The row or taller first wherever more than one is offered,
   because the first is what a widget gets when it is added and
   a board that starts half-width reads as a board somebody has
   already fiddled with. Which of `wide` and `tall` leads is the
   kind's own choice: a board of headlines is a LIST and arrives
   with room for one. */
for (const kind of WIDGETS) {
  if (kind.sizes.length < 2) continue;
  ok(`${kind.id} is added at the row's width`, kind.sizes[0] !== "small",
    `${kind.id} arrives at "${kind.sizes[0]}"`);
}

/* ------------------------------------------------------------
   2. The default layout

   It is what a reader who has arranged nothing sees, which is
   almost all of them, so it is the layout that matters most and
   the one nothing else would check.
   ------------------------------------------------------------ */

for (const entry of HOME_DEFAULT) {
  const placed = parsePlaced(entry, all);
  ok(`the default's ${entry} is a real widget at a real size`, placed !== null,
    "A default that does not parse is a front page with nothing on it, for "
    + "everybody, on first run.");
  if (!placed) continue;
  const kind = WIDGETS.find((w) => w.id === placed.id);
  ok(`${placed.id} is offered at ${placed.size}`,
    kind?.sizes.includes(placed.size),
    `it offers ${kind?.sizes.join(", ")}`);
}

/* And it holds nothing that needs an account, because the first
   thing a stranger sees cannot be four boxes saying sign in. */
for (const entry of HOME_DEFAULT) {
  const id = entry.split(":")[0];
  const kind = WIDGETS.find((w) => w.id === id);
  ok(`the default's ${id} works signed out`, kind?.needs !== "account",
    "The default board is what a stranger meets. A widget that needs an "
    + "account draws a sign-in prompt where a figure should be, and four of "
    + "those is a front page that has locked its own door.");
}

/* ------------------------------------------------------------
   3. Reading a layout, which is where the versions cross
   ------------------------------------------------------------ */

is("nothing stored gives the default",
  storedOf(layoutOf(null, all)), [...HOME_DEFAULT]);
is("an empty layout gives the default too",
  storedOf(layoutOf([], all)), [...HOME_DEFAULT],
);

/* The one that matters. A phone on a newer build writes a widget
   this browser has never heard of; the board has to come back
   one card short rather than not at all. */
is("a widget this build cannot draw is dropped, not fatal",
  storedOf(layoutOf(["pulse:wide", "hologram:wide", "schools:wide"], all)),
  ["pulse:wide", "schools:wide"]);

is("a size this build does not know is dropped",
  storedOf(layoutOf(["pulse:enormous", "schools:wide"], all)),
  ["schools:wide"]);

/* THE BOARDS ALREADY IN ACCOUNTS. `half` and `full` were the
   first two sizes and `home-board` holds them in real rows, so
   they are read for ever and written never: a board saved before
   the three sizes existed comes back whole, spelled the new way.
   The day this fails is the day everybody who arranged a board
   before the sizes shipped opens an empty page. */
is("the first two sizes are read for ever",
  storedOf(layoutOf(["pulse:full", "stock:half"], all)),
  ["pulse:wide", "stock:small"]);

is("and never written back",
  storedOf(layoutOf(["schools:full"], all)).some((s) => s.includes("full")),
  false);

is("rubbish is dropped", storedOf(layoutOf(["", ":", "pulse"], all)), []);

is("an alias still needs a real widget in front of it",
  layoutOf(["hologram:half"], all).length, 0);

/* A reader who has emptied their board gets an empty board. It
   is not the same as never having arranged one, and falling back
   to the default there would be the page overruling them. */
is("an entry list that parses to nothing stays nothing",
  layoutOf(["nothing:wide"], all).length, 0);

is("one of each, and the first wins",
  storedOf(layoutOf(["pulse:wide", "pulse:small"], all)), ["pulse:wide"]);

is("the order is the reader's",
  layoutOf(["tools:wide", "schools:wide", "pulse:wide"], all).map((p) => p.id),
  ["tools", "schools", "pulse"]);

/* `drawable` is what the CALLER can draw, which is not the
   catalogue: that is the whole reason it is an argument. A build
   with two renderers draws two things however long the
   catalogue is. */
/* Derived from the default rather than restating it. Written out,
   this said `["pulse:tall", "schools:wide"]` and failed the day
   the schools' tiles started carrying pictures and went full
   width: a second copy of the data, in the file that checks the
   data. What is being asserted is that a build with two renderers
   draws two things, at whatever size the default gives them. */
is("a build that draws two widgets draws two",
  storedOf(layoutOf([...HOME_DEFAULT], ["pulse", "schools"])),
  HOME_DEFAULT.filter((e) => e.startsWith("pulse:") || e.startsWith("schools:")));

is("a round trip is the identity",
  storedOf(layoutOf(["market:tall", "stock:small"], all)),
  ["market:tall", "stock:small"]);

/* ------------------------------------------------------------ */
const total = passed + failures.length;
if (failures.length) {
  console.error(`\nwidgets: ${failures.length} of ${total} failed\n`);
  for (const f of failures) console.error(`  x ${f}`);
  process.exit(1);
}
console.log(`widgets: ${passed} checks, ${WIDGETS.length} kinds, `
  + `${HOME_DEFAULT.length} on the default board\n`);
