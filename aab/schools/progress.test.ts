#!/usr/bin/env node
/* progress.test.ts: what the three schools' progress modules do.

       node aab/schools/progress.test.ts

   Two things here break silently and are why this file exists:

     THE KEYS. `deutsch-read`, `english-day`, `quran-done` and
     the rest are in real browsers and in real accounts, and
     `aab/sync.js` maps them by name. Renaming one loses
     somebody's ticks, so every key each school writes is
     asserted BY NAME, read off the storage rather than off the
     source.

     THE SHAPES. Three hubs read `stats.live`, `stats.days` and
     `stats.next`; a differently shaped return breaks a page that
     no check reading HTML would see, because the HTML is fine
     and the number in it is a dash.

   No browser: localStorage and the few DOM calls are stubbed.
   `aab/tsconfig.test.json` typechecks the annotations below and
   `scripts/check-types.ts` runs it. */

import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const AAB = join(dirname(fileURLToPath(import.meta.url)), "..");

/* The modules import each other the way a browser asks for them,
   `/deutsch/curriculum.js`, because that is what the served page
   does. Node reads a leading slash as a filesystem path, so this
   points those at aab/ and leaves every other specifier alone. */
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("/")) {
      return { url: pathToFileURL(join(AAB, specifier)).href, shortCircuit: true };
    }
    return next(specifier, context);
  },
});

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}\n      ${detail}` : name);
};
const same = (name: string, a: unknown, b: unknown): void => ok(name, Object.is(a, b),
  `expected ${JSON.stringify(a)}, got ${JSON.stringify(b)}`);
const sameSet = (name: string, a: Iterable<unknown>, b: Iterable<unknown>): void => ok(name,
  JSON.stringify([...a].sort()) === JSON.stringify([...b].sort()),
  `expected ${JSON.stringify([...a].sort())}, got ${JSON.stringify([...b].sort())}`);
const hasKeys = (name: string, obj: object, keys: string[]): void => ok(name,
  keys.every((k) => k in obj),
  `missing ${keys.filter((k) => !(k in obj)).join(", ")} from ${JSON.stringify(obj)}`);

/* ------------------------------------------------------------
   what the two modules under test are, as far as tsc can know

   Both are fetched from a computed address, `/${n}/progress.js`,
   which is the address the browser fetches them from and is not a
   specifier tsc can resolve. So the shapes below are this file's
   claim about them, and `exported()` is what turns a claim into a
   check: a school that renames one of these fails here, by name,
   rather than as "not a function" thirty lines later.
   ------------------------------------------------------------ */

/** One page of a school, and whether it has been written yet. */
interface Lesson {
  id: string;
  status?: string;
}

/** A rung of a school's ladder. `workbook` is the practice book,
    which two of the three have. */
interface Stage {
  slug: string;
  workbook?: { days?: number } | null;
}

/** The three names each school spells for itself, out of its own
    `curriculum.js`. A school has the pair its row below names and
    not the other four. */
interface CurriculumModule {
  STUFEN?: Stage[];
  TERMS?: Stage[];
  DHAPS?: Stage[];
  allTeile?: () => Lesson[];
  allParts?: () => Lesson[];
  allLessons?: () => Lesson[];
}

type Mark = (id: string) => void;

/** What a hub row draws. */
interface StageStats {
  done: number;
  total: number;
  live: number;
  pct: number;
  complete: boolean;
  started: boolean;
}

/** What the bar at the top of a hub draws. `days` and `totalDays`
    belong to the school that counts in days rather than pages. */
interface OverallStats {
  done: number;
  live: number;
  pct: number;
  complete: boolean;
  days?: number;
  totalDays?: number;
}

/** A practice book's own count. */
interface DayStats {
  done: number;
  next: number;
}

/** Where a reader was. The stage is filed under the school's own
    word for one, so it is read by that name rather than a fixed
    one. */
interface Bookmark {
  id: string;
  url: string;
  bn: string;
  ts: number;
  [stage: string]: string | number;
}

/** The shared half of a school's progress module, plus the names
    each school spells its own way. */
interface ProgressModule {
  overallStats: () => OverallStats;
  nextUp: () => Lesson | null;
  setLast: (mark: Record<string, string>) => void;
  getLast: () => Bookmark | null;
  recordVisit: () => string | null;
  resetAll: () => void;
  dayStats: (stage: Stage) => DayStats;
  allDayStats: () => DayStats;
  toggleDay: (stage: Stage, day: number) => void;
  isDayDone: (stage: Stage, day: number) => boolean;
  nextBook: () => Stage | null;
  setLastDay: (day: number) => void;
  getLastDay: () => number;
  markRead?: Mark;
  markDone?: Mark;
  unmarkRead?: Mark;
  unmarkDone?: Mark;
  readSet?: () => Set<string>;
  doneSet?: () => Set<string>;
  isRead?: (id: string) => boolean;
  isDone?: (id: string) => boolean;
  stufeStats?: (stage: Stage) => StageStats;
  termStats?: (stage: Stage) => StageStats;
  dhapStats?: (stage: Stage) => StageStats;
  stufeState?: (stage: Stage) => string;
  termState?: (stage: Stage) => string;
  dhapState?: (stage: Stage) => string;
  currentStufe?: () => Stage | null;
  currentTerm?: () => Stage | null;
  currentDhap?: () => Stage | null;
}

/** One export named by the row below, with the name in the message
    so that a rename says which one. */
function exported<T>(value: T | undefined, name: string): T {
  if (value === undefined) throw new Error(`${name} is not exported`);
  return value;
}

/* ------------------------------------------------------------
   the browser, in about twenty lines

   Everything the module touches and nothing else. `store` is
   handed back so a test can ask what was actually written, by
   key, which is the assertion that matters most here.
   ------------------------------------------------------------ */

interface Stub {
  store: Map<string, string>;
  fired: string[];
}

function stubBrowser(
  { title = "", path = "/", attrs = {} }:
  { title?: string; path?: string; attrs?: Record<string, string> } = {},
): Stub {
  const store = new Map<string, string>();
  const fired: string[] = [];

  const has = Object.keys(attrs).length > 0;
  const article = {
    getAttribute: (n: string) => (n in attrs ? attrs[n] : null),
    hasAttribute: (n: string) => n in attrs,
  };

  /* One assignment rather than six, because `globalThis` is typed:
     every name below already means something in a browser, and
     these stubs are a fraction of each. */
  Object.assign(globalThis, {
    localStorage: {
      getItem: (k: string) => (store.has(k) ? store.get(k) : null),
      setItem: (k: string, v: unknown) => store.set(k, String(v)),
      removeItem: (k: string) => store.delete(k),
    },
    addEventListener: () => {},
    dispatchEvent: (e: { type: string }) => { fired.push(e.type); return true; },
    CustomEvent: class {
      type: string;
      constructor(type: string) { this.type = type; }
    },
    location: { pathname: path },
    document: { title, querySelector: () => (has ? article : null) },
  });

  return { store, fired };
}

/* ------------------------------------------------------------
   the three schools, and the words each one uses

   Every school is driven through the identical sequence. Where
   the expected answer is a count it is computed from that
   school's own curriculum.js rather than typed here, so a school
   that grows a stage does not fail this file.
   ------------------------------------------------------------ */

/** One school, and every name it spells for itself. The strings
    are read as keys off the two modules above, which is why they
    are narrowed to the names those modules really carry. */
interface SchoolCase {
  id: string;
  keys: { read: string; days?: string; last: string; tag?: string };
  ladder: "STUFEN" | "TERMS" | "DHAPS";
  all: "allTeile" | "allParts" | "allLessons";
  stageProp: "stufe" | "term" | "dhap";
  stats: "stufeStats" | "termStats" | "dhapStats";
  state: "stufeState" | "termState" | "dhapState";
  current: "currentStufe" | "currentTerm" | "currentDhap";
  mark: "markRead" | "markDone";
  unmark: "unmarkRead" | "unmarkDone";
  set: "readSet" | "doneSet";
  is: "isRead" | "isDone";
  book: boolean;
  title: string;
  path: string;
  attrs: Record<string, string>;
  visitId: string;
  visitBn: string;
}

const SCHOOLS: SchoolCase[] = [
  {
    id: "deutsch",
    keys: { read: "deutsch-read", days: "deutsch-days", last: "deutsch-last", tag: "deutsch-tag" },
    ladder: "STUFEN",
    all: "allTeile",
    stageProp: "stufe",
    stats: "stufeStats", state: "stufeState", current: "currentStufe",
    mark: "markRead", unmark: "unmarkRead", set: "readSet", is: "isRead",
    book: true,
    title: "Laute – Stufe 1",
    path: "/deutsch/stufe-1/laute.html",
    attrs: { "data-teil-id": "stufe-1/laute", "data-stufe": "stufe-1", "data-teil-title": "Laute" },
    visitId: "stufe-1/laute",
    visitBn: "Laute",
  },
  {
    id: "english",
    keys: { read: "english-read", days: "english-days", last: "english-last", tag: "english-day" },
    ladder: "TERMS",
    all: "allParts",
    stageProp: "term",
    stats: "termStats", state: "termState", current: "currentTerm",
    mark: "markRead", unmark: "unmarkRead", set: "readSet", is: "isRead",
    book: true,
    title: "Alphabet: টার্ম ১",
    path: "/english/term-1/alphabet.html",
    attrs: { "data-part-id": "term-1/alphabet", "data-term": "term-1", "data-part-title": "Alphabet" },
    visitId: "term-1/alphabet",
    visitBn: "Alphabet",
  },
  {
    id: "quran",
    keys: { read: "quran-done", last: "quran-last" },
    ladder: "DHAPS",
    all: "allLessons",
    stageProp: "dhap",
    stats: "dhapStats", state: "dhapState", current: "currentDhap",
    mark: "markDone", unmark: "unmarkDone", set: "doneSet", is: "isDone",
    book: false,
    title: "প্রথম দিন: ধাপ ১",
    path: "/quran/dhap-1/day-1.html",
    attrs: { "data-lesson-id": "dhap-1/day-1", "data-dhap": "dhap-1", "data-lesson-title": "প্রথম দিন" },
    visitId: "dhap-1/day-1",
    visitBn: "প্রথম দিন",
  },
];

for (const S of SCHOOLS) {
  const n = S.id;
  const cur: CurriculumModule = await import(`/${n}/curriculum.js`);
  const stages = exported(cur[S.ladder], `${n}: ${S.ladder}`);
  const lessons = exported(cur[S.all], `${n}: ${S.all}`)();
  const live = lessons.filter((l) => l.status === "live");

  /* A fresh browser before the module is loaded, because loading
     it is the first thing a page does. */
  const { store } = stubBrowser({ title: S.title, path: S.path, attrs: S.attrs });
  const P: ProgressModule = await import(`/${n}/progress.js`);

  const mark = exported(P[S.mark], `${n}: ${S.mark}`);
  const unmark = exported(P[S.unmark], `${n}: ${S.unmark}`);
  const readSet = exported(P[S.set], `${n}: ${S.set}`);
  const isRead = exported(P[S.is], `${n}: ${S.is}`);
  const stageStats = exported(P[S.stats], `${n}: ${S.stats}`);
  const stageState = exported(P[S.state], `${n}: ${S.state}`);
  const currentStage = exported(P[S.current], `${n}: ${S.current}`);

  /* ---- nothing read yet ---- */

  same(`${n}: a new reader has read nothing`, 0, P.overallStats().done);
  same(`${n}: and has started no stage`, false, stageStats(stages[0]).started);
  same(`${n}: the first written lesson is what is next`, live[0].id, P.nextUp()?.id);
  same(`${n}: and the stage they are in is the first`, stages[0].slug, currentStage()?.slug);
  same(`${n}: nothing is written to storage by loading the module`, 0, store.size);

  /* ---- reading ---- */

  live.slice(0, 11).forEach((l) => mark(l.id));
  unmark(live[3].id);

  same(`${n}: ten lessons read`, 10, P.overallStats().done);
  same(`${n}: the eleventh is what is next`, live[3].id, P.nextUp()?.id);
  same(`${n}: a read lesson says so`, true, isRead(live[0].id));
  same(`${n}: an unread one does not`, false, isRead(live[3].id));
  same(`${n}: and neither does a lesson that does not exist`, false, isRead("nonsense"));
  sameSet(`${n}: the set is exactly what was marked`,
    live.slice(0, 11).filter((l) => l.id !== live[3].id).map((l) => l.id), readSet());

  /* THE KEY. Not "a key", this one, spelled this way. */
  ok(`${n}: the ticks are filed under ${S.keys.read}`, store.has(S.keys.read),
    `wrote ${[...store.keys()].join(", ") || "nothing"}`);
  same(`${n}: and nothing else was written by reading`, 1, store.size);

  /* ---- the shape three hubs read ---- */

  hasKeys(`${n}: a stage's stats carry what a hub row draws`, stageStats(stages[0]),
    ["done", "total", "live", "pct", "complete", "started"]);
  hasKeys(`${n}: the ladder's stats carry what the top bar draws`, P.overallStats(),
    ["done", "live", "pct", "complete"]);
  same(`${n}: a percentage is a whole number`, true,
    Number.isInteger(stageStats(stages[0]).pct));
  same(`${n}: an unstarted ladder is not complete`, false, P.overallStats().complete);

  /* ---- the ladder's states ---- */

  const states = stages.map((s) => stageState(s));
  ok(`${n}: every stage has a state a hub knows how to label`,
    states.every((s) => ["done", "now", "next", "past", "later"].includes(s)),
    states.join(", "));
  same(`${n}: exactly one stage is the one they are in`, 1,
    states.filter((s) => s === "now").length);

  /* ---- where they were ---- */

  P.setLast({ id: live[2].id, [S.stageProp]: stages[0].slug, url: "/x", bn: "x" });
  const last = P.getLast();
  same(`${n}: the bookmark comes back`, live[2].id, last?.id);
  same(`${n}: with the stage it was set with`, stages[0].slug, last?.[S.stageProp]);
  ok(`${n}: and a timestamp`, Number.isFinite(last?.ts));
  ok(`${n}: filed under ${S.keys.last}`, store.has(S.keys.last));

  /* ---- opening a lesson ---- */

  same(`${n}: opening a lesson records it`, S.visitId, P.recordVisit());
  same(`${n}: and moves the bookmark to it`, S.visitId, P.getLast()?.id);
  same(`${n}: with the title off the page`, S.visitBn, P.getLast()?.bn);
  same(`${n}: and the address it was read at`, S.path, P.getLast()?.url);

  /* ---- the practice book, where there is one ---- */

  if (S.book) {
    const book = exported(stages.find((s) => s.workbook?.days), `${n}: a stage with a book`);
    same(`${n}: an untouched book has no days done`, 0, P.dayStats(book).done);
    same(`${n}: and points at day one`, 1, P.dayStats(book).next);

    [1, 2, 3, 7].forEach((d) => P.toggleDay(book, d));
    P.toggleDay(book, 2);

    same(`${n}: ticking is a toggle`, 3, P.dayStats(book).done);
    same(`${n}: an untick sticks`, false, P.isDayDone(book, 2));
    same(`${n}: a tick sticks`, true, P.isDayDone(book, 1));
    same(`${n}: and the next day is the first gap`, 2, P.dayStats(book).next);
    same(`${n}: every book adds up`, 3, P.allDayStats().done);
    ok(`${n}: the book still being skipped is offered`, P.nextBook()?.slug);
    ok(`${n}: the days are filed under ${S.keys.days}`, store.has(String(S.keys.days)));

    P.setLastDay(12);
    same(`${n}: the book remembers where it was left`, 12, P.getLastDay());
    ok(`${n}: under ${S.keys.tag}`, store.has(String(S.keys.tag)));
  } else {
    same(`${n}: a school with no book has no days key`, undefined, S.keys.days);
    same(`${n}: and counts in days rather than pages`, true,
      Number.isInteger(P.overallStats().days));
    ok(`${n}: which is not the same number as the pages`,
      (P.overallStats().totalDays ?? 0) >= P.overallStats().live);
  }

  /* ---- every key, and only those keys ---- */

  sameSet(`${n}: the keys written are exactly the ones this school owns`,
    Object.values(S.keys), [...store.keys()]);

  /* ---- resetting ---- */

  P.resetAll();
  same(`${n}: resetting empties the storage`, 0, store.size);
  same(`${n}: and the ticks with it`, 0, readSet().size);
  same(`${n}: and the bookmark`, null, P.getLast());
}

/* ------------------------------------------------------------
   and the thing that must never be true again
   ------------------------------------------------------------ */

const all = SCHOOLS.flatMap((S) => Object.values(S.keys));
sameSet("no two schools share a storage key", all, new Set(all));

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("Three schools, one engine, and every key still spelled the way\n"
  + "it is spelled in somebody's browser.\n");
