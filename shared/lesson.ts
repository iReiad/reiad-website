/* ============================================================
   lesson.ts: what an interactive part of a lesson is.

   A lesson of the money school is two bodies and a bag of
   blocks. The bodies are prose, one Bangla and one English, and
   they carry empty mount points:

       <div class="mount" data-mount="pe-lab"></div>

   This file is the shape of what goes in one, the parser that
   reads a row's `blocks` column, and the validator both
   `scripts/check-money.ts` and the Studio run. MONEY.md is the
   argument for all of it.

   ---- one definition, two languages ----

   Every string a reader sees is a `Say`: `{ bn, en }`. A block
   is therefore said ONCE and shown in whichever language the
   reader is in, which is the only arrangement where a quiz
   cannot disagree with itself about which answer is right. The
   prose is two bodies because prose is written rather than
   translated; a block is data.

   ---- what is data here and what is code ----

   A `lab` names a MODEL and the model is code, in
   `shared/lesson-labs.ts`. A formula stored in a database row is
   code in a place nothing typechecks and nothing can test, and
   the rule in CLAUDE.md about a calculator's arithmetic needing
   an app release is the same rule seen from the other end: the
   arithmetic is code, its inputs are data. The same goes for a
   `figure`: the SHAPES are drawn by `next/components/lesson/
   figure.tsx` and what a given figure says is data.

   So a new BLOCK is a row in a database and reaches the Android
   app on its next fetch. A new KIND is a release.
   ============================================================ */

/** One phrase, in both languages. Bangla first in the type as
    well as on the site: it is the learning language, and the one
    a reader with JavaScript off is given. */
export interface Say {
  bn: string;
  en: string;
}

/** What a thing means, rather than what colour it is. Six tones,
    and the stylesheet decides what each looks like, so a block
    that says `bad` is still legible when somebody changes the
    palette.

      good   this is the desirable one
      bad    this loses you money
      warn   true, and there is a catch
      pick   the reader chose this
      plain  no opinion
      lead   the one the eye should land on first */
export type Tone = "good" | "bad" | "warn" | "pick" | "plain" | "lead";

export const TONES: readonly Tone[] = ["good", "bad", "warn", "pick", "plain", "lead"];

/* ------------------------------------------------------------
   The eleven kinds
   ------------------------------------------------------------ */

interface BlockBase {
  /** The heading over the block. A block with no title is a
      block a reader meets mid-sentence, which is right for a
      small figure and wrong for a quiz. */
  title?: Say;
  /** One line under the title, saying what to do. */
  note?: Say;
}

/** Answer, and be told why each option is right or wrong.

    Every option carries a `why`, not only the wrong ones. A quiz
    that explains itself only when you are wrong teaches you to
    guess until the red goes away. */
export interface QuizBlock extends BlockBase {
  kind: "quiz";
  questions: {
    ask: Say;
    /** More than one `right` makes it a select-all, and the
        component says so rather than letting a reader find out
        by being marked wrong. */
    options: { text: Say; right?: boolean; why: Say }[];
  }[];
}

/** Put the steps of a process in the order they happen.

    The array IS the answer, in order. The component shuffles it
    deterministically from the mount id, so the puzzle is the
    same on the server and in the browser and the same on two
    devices. */
export interface OrderBlock extends BlockBase {
  kind: "order";
  items: { text: Say; why?: Say }[];
}

/** Pair a word with what it means. Left is the prompt, right is
    the answer, and the component shuffles the right column. */
export interface MatchBlock extends BlockBase {
  kind: "match";
  pairs: { left: Say; right: Say }[];
}

/** Drop things into buckets: asset or liability, cost or
    revenue, your job or somebody else's. */
export interface BinsBlock extends BlockBase {
  kind: "bins";
  bins: { id: string; label: Say; tone?: Tone }[];
  items: { text: Say; bin: string; why?: Say }[];
}

/** Sliders, a number that moves, and usually a chart.

    `model` names a function in `shared/lesson-labs.ts`, which
    owns the arithmetic AND the inputs: their ranges, their units
    and their defaults. `preset` moves a default for this lesson,
    `hide` takes an input off the panel and pins it, and neither
    can invent an input the model does not have. */
export interface LabBlock extends BlockBase {
  kind: "lab";
  model: string;
  preset?: Record<string, number>;
  hide?: string[];
}

/** A figure with numbers in it that the reader can hover.

    Data rather than a picture, so it is right in both themes,
    readable on a phone, and a screen reader gets the same table
    the eye gets. */
export interface ChartBlock extends BlockBase {
  kind: "chart";
  shape: "line" | "bar" | "stack" | "donut";
  /** The x axis, one label per point. Plain strings: they are
      numbers or years far more often than words, and `bnNum`
      turns digits into Bangla digits at render. */
  labels: string[];
  series: { name: Say; values: number[]; tone?: Tone }[];
  /** What the numbers are, for the axis and the tooltip. */
  unit?: Say;
  /** A line the reader should notice: a target, a zero, an
      inflation rate the bars have to clear. */
  mark?: { at: number; label: Say };
  /** Where the numbers came from. A chart with no source on a
      site about money is an opinion drawn as a fact. */
  source?: Say;
}

export type FigureShape =
  | "flow" | "stack" | "scale" | "matrix" | "cycle"
  | "steps" | "timeline" | "callouts" | "venn" | "tree";

/** A drawing, from data.

   Ten shapes, and between them they cover what this school
   actually has to show: a process, a thing broken into parts, a
   trade-off, two axes, a loop, a climb, a history, a screen with
   numbers on it, an overlap, and a hierarchy. A photograph of a
   trading floor teaches none of those. */
export interface FigureBlock extends BlockBase {
  kind: "figure";
  shape: FigureShape;
  /** Boxes, steps, slices, points: whatever the shape reads. A
      `stack` reads `value`, a `matrix` reads four in order, a
      `callouts` reads `at` as the row it points at. */
  parts: { text: Say; note?: Say; value?: number; tone?: Tone; at?: number }[];
  /** The two axes of a `matrix`, the two circles of a `venn`,
      the two arms of a `scale`. Nothing else reads it. */
  axes?: { x?: [Say, Say]; y?: [Say, Say] };
  /** The mock screen a `callouts` figure points at, and the root
      of a `tree`. `rows` is optional because a tree uses the
      title alone; `blockProblems` requires the rows on a
      `callouts`, which is where they mean something. */
  screen?: { title?: Say; rows?: { label: Say; value: Say }[] };
  caption?: Say;
}

/** Commit to a guess, then see the answer. The single cheapest
    piece of teaching there is: a reader who has guessed reads
    the answer, and a reader who has not skims it. */
export interface RevealBlock extends BlockBase {
  kind: "reveal";
  ask: Say;
  /** Optional, and where it is absent the reader presses one
      button rather than choosing. A guess made in the head still
      counts. */
  choices?: Say[];
  answer: Say;
  why: Say;
}

/** Two or three things side by side, one row per question a
    reader would actually ask. `best` marks the column that wins
    that row, and a row where nothing wins leaves it out. */
export interface CompareBlock extends BlockBase {
  kind: "compare";
  columns: Say[];
  rows: { label: Say; cells: Say[]; best?: number }[];
}

/** Find what is wrong in an excerpt.

    Lines a reader clicks; the ones with a `flag` are the
    problems and the ones without are there so that finding them
    is work. */
export interface SpotBlock extends BlockBase {
  kind: "spot";
  source: Say;
  lines: { text: Say; flag?: Say }[];
}

/** A SHEET THE READER TYPES INTO.

    `model` names a table in `shared/lesson-grids.ts`, which owns
    the rows, the columns, which cells are the reader's and what
    the computed ones are computed from. Same arrangement as a
    lab, and for the same reason: the Android app renders the
    same rows and a table whose arithmetic lived in a component
    would be a table the app could not compute.

    `preset` moves an opening number for this lesson and cannot
    invent a cell the model does not have, exactly as a lab's
    does. There is no `hide`: a sheet with a row taken out of it
    is a different sheet, and a total that no longer adds up is
    worse than a row somebody did not want. */
export interface GridBlock extends BlockBase {
  kind: "grid";
  model: string;
  preset?: Record<string, number>;
}

/** Something to do away from the screen, ticked off here.

    It is deliberately not marked and not scored: nothing on this
    site can see whether somebody really opened a broker's app.
    What it can do is keep the list, so a reader coming back a
    week later knows which three of the five they did. */
export interface DrillBlock extends BlockBase {
  kind: "drill";
  steps: { text: Say; hint?: Say }[];
}

export type Block =
  | QuizBlock | OrderBlock | MatchBlock | BinsBlock | LabBlock
  | ChartBlock | FigureBlock | RevealBlock | CompareBlock
  | SpotBlock | DrillBlock | GridBlock;

export type BlockKind = Block["kind"];

export const BLOCK_KINDS: readonly BlockKind[] = [
  "quiz", "order", "match", "bins", "lab", "chart",
  "figure", "reveal", "compare", "spot", "drill", "grid",
];

export const FIGURE_SHAPES: readonly FigureShape[] = [
  "flow", "stack", "scale", "matrix", "cycle",
  "steps", "timeline", "callouts", "venn", "tree",
];

/** A lesson's blocks: mount id to block. */
export type Blocks = Record<string, Block>;

/* ------------------------------------------------------------
   Reading them out of a row
   ------------------------------------------------------------ */

/** The mount marker, in either attribute order.

    The server's sanitiser keeps attributes in the order it found
    them, so `class` before `data-mount` and the other way round
    are both things a row can hold. A splitter that matched one
    of the two would drop every block in a lesson whose author
    typed the attributes the other way, and the page would render
    perfectly without them. */
export const MOUNT = /<div\s+(?:class="mount"\s+data-mount="([\w-]+)"|data-mount="([\w-]+)"\s+class="mount")\s*>\s*<\/div>/g;

/** The mount ids a body carries, in order. */
export const mountsIn = (html: string): string[] =>
  [...String(html ?? "").matchAll(MOUNT)].map((m) => m[1] ?? m[2]);

/** A body cut at its mounts: `parts` is one longer than `ids`,
    so the two interleave as part, block, part, block, part. */
export const splitBody = (html: string): { parts: string[]; ids: string[] } => {
  const source = String(html ?? "");
  const parts: string[] = [];
  const ids: string[] = [];
  let last = 0;
  for (const m of source.matchAll(MOUNT)) {
    parts.push(source.slice(last, m.index));
    ids.push(m[1] ?? m[2]);
    last = (m.index ?? 0) + m[0].length;
  }
  parts.push(source.slice(last));
  return { parts, ids };
};

/** The `blocks` column, parsed. A row that holds nothing, or
    holds something that is not an object, is a lesson with no
    blocks rather than a lesson that throws: the prose is the
    lesson and a broken block must never take it down. */
export const parseBlocks = (raw: unknown): Blocks => {
  if (!raw) return {};
  if (typeof raw === "object") return raw as Blocks;
  try {
    const parsed = JSON.parse(String(raw));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Blocks
      : {};
  } catch {
    return {};
  }
};

/* ------------------------------------------------------------
   Validating them

   `check-money.ts` runs this over every lesson, and it is
   written to return every problem rather than the first, because
   a seed of eighty lessons fixed one message at a time is eighty
   runs.
   ------------------------------------------------------------ */

const isSay = (v: unknown): boolean =>
  !!v && typeof v === "object"
  && typeof (v as Say).bn === "string" && (v as Say).bn.trim() !== ""
  && typeof (v as Say).en === "string" && (v as Say).en.trim() !== "";

/** Everything wrong with one block, as sentences. Empty is a
    pass. `models` and `shapes` are handed in rather than
    imported so that this file stays the shape and
    `lesson-labs.ts` stays the arithmetic: a validator that
    imported every model would pull the whole calculator library
    into the Android app's copy of this file. */
export function blockProblems(
  id: string, block: unknown, models: readonly string[] = [],
  grids: readonly string[] = [],
): string[] {
  const out: string[] = [];
  const at = (what: string): void => { out.push(`${id}: ${what}`); };

  if (!block || typeof block !== "object") {
    at("is not an object");
    return out;
  }
  const b = block as Record<string, unknown>;
  const kind = b.kind as BlockKind;
  if (!BLOCK_KINDS.includes(kind)) {
    at(`kind "${String(b.kind)}" is not one of ${BLOCK_KINDS.join(", ")}`);
    return out;
  }
  if (b.title !== undefined && !isSay(b.title)) at("title is not a { bn, en }");
  if (b.note !== undefined && !isSay(b.note)) at("note is not a { bn, en }");

  const list = (key: string, min: number): unknown[] => {
    const v = b[key];
    if (!Array.isArray(v) || v.length < min) {
      at(`${key} needs at least ${min}`);
      return [];
    }
    return v;
  };
  const says = (where: string, v: unknown): void => {
    if (!isSay(v)) at(`${where} is not a { bn, en }`);
  };

  switch (kind) {
    case "quiz": {
      for (const [n, q] of list("questions", 1).entries()) {
        const question = q as Record<string, unknown>;
        says(`question ${n + 1} ask`, question.ask);
        const options = Array.isArray(question.options) ? question.options : [];
        if (options.length < 2) at(`question ${n + 1} needs at least two options`);
        if (!options.some((o) => (o as Record<string, unknown>).right)) {
          at(`question ${n + 1} has no right answer`);
        }
        for (const [i, o] of options.entries()) {
          const option = o as Record<string, unknown>;
          says(`question ${n + 1} option ${i + 1}`, option.text);
          /* Every option, not only the wrong ones. A quiz that
             explains itself only when a reader is wrong teaches
             guessing until the red goes away. */
          says(`question ${n + 1} option ${i + 1} why`, option.why);
        }
      }
      break;
    }
    case "order": {
      for (const [n, item] of list("items", 3).entries()) {
        says(`item ${n + 1}`, (item as Record<string, unknown>).text);
      }
      break;
    }
    case "match": {
      for (const [n, pair] of list("pairs", 3).entries()) {
        const p = pair as Record<string, unknown>;
        says(`pair ${n + 1} left`, p.left);
        says(`pair ${n + 1} right`, p.right);
      }
      break;
    }
    case "bins": {
      const bins = list("bins", 2) as Record<string, unknown>[];
      const ids = new Set(bins.map((x) => String(x.id)));
      for (const [n, bin] of bins.entries()) says(`bin ${n + 1}`, bin.label);
      for (const [n, item] of list("items", 3).entries()) {
        const it = item as Record<string, unknown>;
        says(`item ${n + 1}`, it.text);
        if (!ids.has(String(it.bin))) at(`item ${n + 1} goes in bin "${String(it.bin)}", which is not one of them`);
      }
      break;
    }
    case "lab": {
      const model = String(b.model ?? "");
      if (!model) at("names no model");
      else if (models.length && !models.includes(model)) {
        at(`model "${model}" is not in shared/lesson-labs.ts`);
      }
      break;
    }
    case "grid": {
      const model = String(b.model ?? "");
      if (!model) at("names no sheet");
      else if (grids.length && !grids.includes(model)) {
        at(`sheet "${model}" is not in shared/lesson-grids.ts`);
      }
      break;
    }
    case "chart": {
      if (!["line", "bar", "stack", "donut"].includes(String(b.shape))) {
        at(`shape "${String(b.shape)}" is not line, bar, stack or donut`);
      }
      const labels = list("labels", 1) as string[];
      for (const [n, s] of list("series", 1).entries()) {
        const series = s as Record<string, unknown>;
        says(`series ${n + 1} name`, series.name);
        const values = Array.isArray(series.values) ? series.values : [];
        /* A series shorter than the axis draws a line that stops
           halfway and looks like data ending rather than like a
           row somebody mistyped. */
        if (values.length !== labels.length) {
          at(`series ${n + 1} has ${values.length} values for ${labels.length} labels`);
        }
        if (values.some((v) => typeof v !== "number" || !Number.isFinite(v))) {
          at(`series ${n + 1} holds something that is not a number`);
        }
      }
      break;
    }
    case "figure": {
      const shape = String(b.shape) as FigureShape;
      if (!FIGURE_SHAPES.includes(shape)) {
        at(`shape "${shape}" is not one of ${FIGURE_SHAPES.join(", ")}`);
        break;
      }
      const need = shape === "venn" ? 3 : shape === "matrix" ? 4 : 2;
      const parts = list("parts", need) as Record<string, unknown>[];
      if (shape === "matrix" && parts.length !== 4) at("a matrix has exactly four cells");
      if (shape === "venn" && parts.length !== 3) at("a venn has exactly three parts: left, both, right");
      for (const [n, part] of parts.entries()) {
        says(`part ${n + 1}`, part.text);
        if (shape === "stack" && typeof part.value !== "number") {
          at(`part ${n + 1} of a stack needs a value`);
        }
        if (shape === "scale" && typeof part.value !== "number") {
          at(`part ${n + 1} of a scale needs a value`);
        }
      }
      if (shape === "matrix" && !(b.axes as { x?: unknown; y?: unknown })?.x) {
        at("a matrix needs axes.x and axes.y");
      }
      if (shape === "callouts") {
        const screen = b.screen as { rows?: unknown[] } | undefined;
        if (!screen || !Array.isArray(screen.rows) || !screen.rows.length) {
          at("a callouts figure needs a screen with rows");
        } else {
          for (const [n, part] of parts.entries()) {
            const row = Number(part.at);
            if (!Number.isInteger(row) || row < 0 || row >= screen.rows.length) {
              at(`callout ${n + 1} points at row ${String(part.at)}, which the screen does not have`);
            }
          }
        }
      }
      break;
    }
    case "reveal": {
      says("ask", b.ask);
      says("answer", b.answer);
      says("why", b.why);
      if (b.choices !== undefined) {
        const choices = Array.isArray(b.choices) ? b.choices : [];
        if (choices.length < 2) at("choices, where there are any, need at least two");
        for (const [n, c] of choices.entries()) says(`choice ${n + 1}`, c);
      }
      break;
    }
    case "compare": {
      const columns = list("columns", 2) as unknown[];
      for (const [n, c] of columns.entries()) says(`column ${n + 1}`, c);
      for (const [n, r] of list("rows", 2).entries()) {
        const row = r as Record<string, unknown>;
        says(`row ${n + 1} label`, row.label);
        const cells = Array.isArray(row.cells) ? row.cells : [];
        if (cells.length !== columns.length) {
          at(`row ${n + 1} has ${cells.length} cells for ${columns.length} columns`);
        }
        for (const [i, cell] of cells.entries()) says(`row ${n + 1} cell ${i + 1}`, cell);
        if (row.best !== undefined
          && (!Number.isInteger(row.best) || Number(row.best) < 0 || Number(row.best) >= columns.length)) {
          at(`row ${n + 1} says column ${String(row.best)} wins, which is not a column`);
        }
      }
      break;
    }
    case "spot": {
      says("source", b.source);
      const lines = list("lines", 3) as Record<string, unknown>[];
      for (const [n, line] of lines.entries()) {
        says(`line ${n + 1}`, line.text);
        if (line.flag !== undefined) says(`line ${n + 1} flag`, line.flag);
      }
      /* A spot with nothing to find is a paragraph, and a spot
         where everything is a flag teaches a reader to click all
         of them. */
      const flags = lines.filter((l) => l.flag !== undefined).length;
      if (flags === 0) at("has no flagged lines, so there is nothing to find");
      if (flags === lines.length) at("flags every line, so finding them is not work");
      break;
    }
    case "drill": {
      for (const [n, step] of list("steps", 2).entries()) {
        const s = step as Record<string, unknown>;
        says(`step ${n + 1}`, s.text);
        if (s.hint !== undefined) says(`step ${n + 1} hint`, s.hint);
      }
      break;
    }
  }

  /* A block's words are rendered as TEXT, by `T` in
     `lesson/lang.tsx`, and never as HTML. A cross-link written
     into a `why` therefore reaches the reader as the literal
     characters of an anchor tag in the middle of a sentence, on
     a page that renders perfectly. Eight of them shipped that
     way before this asked. Prose carries links; a block carries
     words. */
  for (const found of markupIn(b)) at(`${found} holds markup, and a block's words are rendered as text`);

  return out;
}

const TAG = /<\/?[a-z][^>]*>/i;

/** Every path inside a block whose string value holds a tag. A
    walk rather than a check per kind, because the eleven kinds
    put their words in eleven shapes and a twelfth would arrive
    unguarded. */
function markupIn(value: unknown, path: string[] = []): string[] {
  if (typeof value === "string") {
    return TAG.test(value) ? [path.join(".") || "a string"] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => markupIn(v, [...path, String(i + 1)]));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => markupIn(v, [...path, k]));
  }
  return [];
}

/** Bangla digits, from `shared/schools.ts` rather than a second
    copy: that one had a Devanagari bug once and does not need a
    second implementation to have it again. Re-exported so a
    component can reach one import for both. */
export { bnNum } from "./schools.ts";

/** The half of a `Say` a language wants. */
export const say = (s: Say | undefined, lang: "bn" | "en"): string =>
  s ? (lang === "bn" ? s.bn : s.en) : "";

/** A stable shuffle, so an `order` puzzle is the same on the
    server, in the browser and on a second device.

    Math.random() here would be a hydration mismatch on every
    lesson that has one: the server picks one order, the browser
    picks another, React discards the difference and prints
    #418, which is the failure that blanked every calculator on
    this site for a day. */
export function shuffled<T>(items: readonly T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const next = (): number => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  /* A shuffle that happens to return the original order is a
     puzzle with nothing to do, and with a fixed seed it stays
     that way for ever. One rotation is enough to break it and
     keeps the result deterministic. */
  if (out.length > 1 && out.every((v, i) => v === items[i])) out.push(out.shift() as T);
  return out;
}
