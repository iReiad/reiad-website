/* ============================================================
   editor.ts: the writing surface, on its own.

   Everything in this file used to live inside studio.js, which was
   fine while there was one Studio. There are two for a while now,
   the page at /studio.html and the React one at /studio/, and a
   `contenteditable` with a sanitiser, a slash menu, markdown rules
   and a figure toolbar is the last thing on this site that should
   exist twice. Each of those has already been the site of a bug
   nobody would find by reading, and every one of those bugs is
   written down below where it happened.

   ---- what belongs here, and what does not ----

   Here: anything that touches the caret, the selection, or the
   HTML the writer is producing. That is not React's work. React is
   a function of state, and a `contenteditable` is a piece of the
   DOM the browser and the user are both editing behind React's
   back; controlling it from a component is how you get a cursor
   that jumps to the end of the line every time somebody types.

   Not here: the fields, the preview, the meters, the pre-flight
   panel, the sheets, the publish button. Those are chrome, they
   are a function of state, and they are exactly what a component
   tree is good at.

   ---- how it is used ----

       const ed = createEditor({
         root: document.getElementById("editor"),
         onChange: () => redraw(),
         lang: () => "bn",
         toast, pickPhoto: () => input.click(),
       });

   The root element is handed in rather than looked up, which is
   the whole of what made this file possible: `studio.js` reached
   for `#editor` at module scope, so importing any part of it meant
   importing a page.
   ============================================================ */

import { encodeImage } from "/photo.js";

/* ============================================================
   1. SANITISER: the pasted-HTML gauntlet
   ============================================================ */

const KEEP = new Set([
  "P", "H2", "H3", "UL", "OL", "LI", "BLOCKQUOTE", "STRONG", "EM", "A", "BR",
  "FIGURE", "FIGCAPTION", "IMG", "HR", "CODE", "TABLE", "THEAD", "TBODY",
  "TR", "TH", "TD", "SUP", "SUB",
]);

/* Word/Docs/Notion synonyms → the tag we actually want */
const RENAME: Record<string, string> = {
  H1: "H2", H4: "H3", H5: "H3", H6: "H3",
  B: "STRONG", I: "EM", U: "EM", MARK: "EM",
  DIV: "P", SECTION: "P", ARTICLE: "P", SPAN: "P", FONT: "P", PRE: "P",
};

/* The attributes an element may keep. This table and `ALLOWED` in
   `functions/_lib/sanitise.ts` are one vocabulary written twice,
   and `check-css.ts` compares them, because they had drifted:
   `hostPhotosIn` in `aab/src/photo.ts` sets `loading` and
   `decoding` on every photo it hosts, this list stripped both on
   the way out, and neither had ever reached the database. Widen
   both or neither. */
const ATTRS: Record<string, string[]> = {
  A: ["href", "title"],
  IMG: ["src", "alt", "width", "height", "loading", "decoding"],
  TD: ["colspan", "rowspan"],
  TH: ["colspan", "rowspan"],
};

/* The class names the stylesheet actually knows about: the same list
   _lib/sanitise.ts enforces server-side.

   Without this the two sanitisers disagreed, and the browser's was
   the stricter one: a <div class="note"> became a plain paragraph and
   figure.wide lost its class on the way out of the editor. Which
   meant the server's support for these was unreachable from the one
   tool that writes to it, and every callout imported from Notion
   arrived flattened.

   check-css.ts reads this list out of this file by name. Renaming
   the constant is fine; moving it somewhere the check cannot see is
   how the two lists drift apart again. */
export const KEEP_CLASSES: Set<string> = new Set([
  /* photos: how big, what shape, and which part to keep */
  "wide", "full", "duo", "lead-photo",
  "frame-wide", "frame-square", "frame-tall", "focus-top", "focus-bottom",
  /* the blocks a long read is made of */
  "at-a-glance", "at-a-glance-label", "side-note", "side-note-label",
  "step-list", "checklist", "figures", "fig",
  "table-scroll", "term", "note", "ex",
]);

/* Which tags may carry one of those classes. The server's
   allowlist says the same thing in its own shape; a class kept
   here on a tag the server strips it from is a block that looks
   right in the editor and arrives plain. */
const CLASS_CARRIERS: Set<string> = new Set(["DIV", "P", "UL", "OL", "FIGURE", "A"]);

const keptClasses = (node: Element): string[] =>
  CLASS_CARRIERS.has(node.tagName)
    ? [...(node.classList ?? [])].filter((c) => KEEP_CLASSES.has(c))
    : [];

/** Turn arbitrary HTML into the small set of tags the site styles. */
export function sanitize(html: string): string {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

  doc.body.querySelectorAll("script, style, meta, link, iframe, object, embed, form, input, button")
    .forEach((n) => n.remove());

  const walk = (node: Element): void => {
    [...node.children].forEach(walk);

    let tag = node.tagName;
    const classes = keptClasses(node);

    // A div is stray markup from whatever produced the paste, unless
    // it carries one of the site's own class names: then it is a
    // note box or a worked example and belongs in the article.
    const structural = tag === "DIV" && classes.length > 0;

    if (!KEEP.has(tag) && !structural && RENAME[tag]) {
      // An inline wrapper (span/font) around text should just dissolve,
      // and a DIV that only holds block content shouldn't become a <p>.
      const hasBlock = [...node.children].some((c) =>
        /^(P|H2|H3|UL|OL|BLOCKQUOTE|FIGURE|TABLE|HR)$/.test(c.tagName)
      );
      if (hasBlock || /^(SPAN|FONT)$/.test(tag)) {
        node.replaceWith(...node.childNodes);
        return;
      }
      const el = doc.createElement(RENAME[tag]);
      el.append(...node.childNodes);
      node.replaceWith(el);
      node = el;
      tag = el.tagName;
    } else if (!KEEP.has(tag) && !structural) {
      node.replaceWith(...node.childNodes);
      return;
    }

    // scrub attributes down to the allowlist
    const allowed = ATTRS[tag] ?? [];
    [...node.attributes].forEach((a) => {
      if (!allowed.includes(a.name.toLowerCase())) node.removeAttribute(a.name);
    });

    // …then put back the classes the site defines, which the scrub
    // above has just removed along with everything else.
    if (classes.length) node.setAttribute("class", classes.join(" "));

    // no javascript: or other exotic URL schemes
    for (const attr of ["href", "src"]) {
      const v = node.getAttribute?.(attr);
      if (!v) continue;
      const safe = /^(https?:|mailto:|data:image\/|\/|#|\.)/i.test(v.trim());
      if (!safe) node.removeAttribute(attr);
    }
    if (tag === "A") {
      // an anchor whose href we just dropped is no longer a link
      if (!node.getAttribute("href")) { node.replaceWith(...node.childNodes); return; }
      node.setAttribute("rel", "noopener");
    }

    // drop empties left behind by the stripping above
    if (!(node.textContent ?? "").trim() && !node.querySelector("img, hr, br")
        && /^(P|H2|H3|LI|BLOCKQUOTE|FIGCAPTION)$/.test(tag)) {
      node.remove();
    }
  };

  [...doc.body.children].forEach(walk);

  // bare text at the top level becomes a paragraph
  [...doc.body.childNodes].forEach((n) => {
    if (n instanceof Text && n.data.trim()) {
      const p = doc.createElement("p");
      p.textContent = n.data.trim();
      n.replaceWith(p);
    }
  });

  // whitespace between blocks is the pasting app's indentation, not content
  [...doc.body.childNodes].forEach((n) => {
    if (n instanceof Text && !n.data.trim()) n.remove();
  });

  // wide tables need their own scroller on a phone
  doc.body.querySelectorAll(":scope > table").forEach((t) => {
    const box = doc.createElement("div");
    box.className = "table-scroll";
    t.replaceWith(box);
    box.append(t);
  });

  // one block per line, so the exported file reads like hand-written HTML
  return [...doc.body.children].map((el) => el.outerHTML).join("\n").trim();
}

/** Plain text → paragraphs, keeping blank-line breaks. */
export function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};

export function escapeHtml(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/* ============================================================
   2. WHAT IS IN THE EDITOR, MEASURED
   ============================================================ */

export function slugify(s: string): string {
  const words = String(s ?? "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .filter(Boolean);

  // stop at ~40 characters, but never mid-word
  let slug = "";
  for (const w of words) {
    if (slug && (slug + "-" + w).length > 40) break;
    slug = slug ? `${slug}-${w}` : w;
  }
  return slug || `article-${new Date().toISOString().slice(0, 10)}`;
}

export interface ReadingStats {
  words: number;
  photos: number;
  minutes: number;
}

export function readingStats(html: string): ReadingStats {
  const text = new DOMParser()
    .parseFromString(html, "text/html").body.textContent || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const photos = (html.match(/<img\b/gi) || []).length;
  return { words, photos, minutes: Math.max(1, Math.round(words / 200)) };
}

export const CAPTION_HINT: string = "Caption: click to edit";

/** Captions the writer never touched shouldn't ship. */
export function dropUntouchedCaptions(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("figcaption").forEach((c) => {
    if ((c.textContent ?? "").trim().startsWith(CAPTION_HINT)) c.remove();
  });
  return doc.body.innerHTML;
}

/* ============================================================
   3. THE WORDS INSIDE A BLOCK

   Written in the language the piece is in, because they are copy,
   not chrome: a Bangla piece with an English "At a glance" over
   its Bangla facts is a piece with an English word in it. Every
   one of them is selected on insert, so the first thing you type
   replaces it.
   ============================================================ */

export const WORDS: Record<"en" | "bn", Record<string, string>> = {
  en: {
    glance: "At a glance", glanceItem: "The first thing worth knowing.",
    note: "Worth knowing", noteBody: "The bit people get wrong.",
    step: "The first step.", check: "The first thing to take.",
    figure: "What it costs", flag: "Something worth flagging.",
    example: "A worked example.",
  },
  bn: {
    glance: "এক নজরে", glanceItem: "প্রথম যেটা জানা দরকার।",
    note: "খেয়াল রাখুন", noteBody: "যেখানে বেশিরভাগ ভুলটা হয়।",
    step: "প্রথম ধাপ।", check: "প্রথম যেটা সঙ্গে নেবেন।",
    figure: "কত খরচ", flag: "যেটা মনে রাখা দরকার।",
    example: "একটা উদাহরণ।",
  },
};

const TABLE_SKELETON =
  '<div class="table-scroll"><table><thead><tr>'
  + "<th data-fill>Column</th><th>Column</th><th>Column</th></tr></thead><tbody>"
  + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"
  + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"
  + "</tbody></table></div>";

/** A chip row: the class, the label on the chip, and the line
    under it. The empty class is the "none of them" option. */
type FigSet = Array<[cls: string, label: string, hint: string]>;

/* ---------- the figure toolbar's three decisions ----------

   Each set is exclusive: picking one clears the others, so a
   figure can never be both square and 16:9 and the markup never
   accumulates the history of what you tried. */
const FIG_SIZES: FigSet = [
  ["", "Normal", "As wide as the text"],
  ["wide", "Wide", "Wider than the text"],
  ["full", "Full", "Edge to edge"],
];
const FIG_FRAMES: FigSet = [
  ["", "As shot", "Whatever shape it came in"],
  ["frame-wide", "16:9", "Cropped wide"],
  ["frame-square", "Square", "Cropped square"],
  ["frame-tall", "4:5", "Cropped tall"],
];
const FIG_FOCUS: FigSet = [
  ["", "Centre", "Keep the middle"],
  ["focus-top", "Top", "Keep the top"],
  ["focus-bottom", "Bottom", "Keep the bottom"],
];

/** Build the <figure> that goes into the editor. */
export function figureHtml(
  { url, width, height }: { url: string; width: number; height: number },
  alt = "",
): string {
  return `<figure><img src="${url}" alt="${escapeHtml(alt)}" width="${width}" height="${height}"`
    + ` loading="lazy" decoding="async"><figcaption>${CAPTION_HINT}, or delete this line`
    + "</figcaption></figure><p><br></p>";
}

export interface ProcessedImage {
  url: string;
  width: number;
  height: number;
  type: string;
}

/** File/Blob → a downscaled WebP as a data URL, for the editor's
    own preview. Publishing turns it into a /media path. */
export async function processImage(file: Blob): Promise<ProcessedImage> {
  const { blob, width, height } = await encodeImage(file);
  return { url: await blobToDataURL(blob), width, height, type: blob.type };
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    /* readAsDataURL always yields a string. The check is what says
       so to a reader as well as to the compiler. */
    fr.onload = () => resolve(typeof fr.result === "string" ? fr.result : "");
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

/** One of the blocks a long read is made of. `key` is present only
    for the ones a toolbar button can name, and every block carries
    exactly one of `run` and `html`. */
export interface Block {
  label: string;
  hint: string;
  key?: string;
  run?: () => void;
  html?: () => string;
}

export interface EditorOptions {
  /** The contenteditable. Handed in rather than looked up, which
      is the whole of what made this file possible. */
  root: HTMLElement;
  /** Something changed, redraw. */
  onChange?: () => void;
  /** "en" or "bn", for the copy inside a block. */
  lang?: () => string | undefined;
  toast?: (message: string) => void;
  /** Open the file picker. */
  pickPhoto?: () => void;
  /** Ctrl+S. */
  onSave?: () => void;
  /** Ctrl+Enter. */
  onPublish?: () => void;
}

/** What the page is handed. Named, because both Studios import
    this type by name from `/editor.js`. */
export interface EditorHandle {
  /** The blocks, for a toolbar that wants to draw its own buttons. */
  blocks: Block[];
  run(block: Block): void;
  byKey(key: string): Block | undefined;

  insertImages(files: FileList | File[]): Promise<void>;
  insertHtmlAtCaret(html: string): void;
  insertBlockHtml(html: string): void;
  /** Ask for a URL and wrap the selection in it. */
  link(): void;
  /** A formatting command straight through to the browser. */
  command(cmd: string, value?: string | null): void;

  html(): string;
  setHtml(value: string): void;
  clear(): void;
  focus(): void;
  /** Take every listener, the slash menu and the figure bar back
      off the page. React unmounts; the old Studio never did. */
  destroy(): void;
}

/* `input` is `Event` in the DOM library and this file reads
   `inputType` and `data` off it, which are InputEvent's. Every
   `input` a contenteditable fires is one. */
interface EditorEventMap extends HTMLElementEventMap {
  input: InputEvent;
}

/* ============================================================
   4. THE EDITOR ITSELF
   ============================================================ */

/** Wire a contenteditable into a writing surface. */
export function createEditor({
  root, onChange, lang = () => "en", toast = () => {}, pickPhoto = () => {},
  onSave, onPublish,
}: EditorOptions): EditorHandle {
  const changed = () => onChange?.();
  const words = () => WORDS[lang() === "bn" ? "bn" : "en"];

  /* Everything this function attaches is collected here, so a React
     component can unmount without leaving a slash menu on the body
     and three listeners on the window. The old Studio never needed
     this because its page only ever had one editor and never took
     it away again. */
  const cleanups: Array<() => void> = [];
  /* `as EventListener` is what addEventListener's own overloads
     cannot express for a target known only as an EventTarget: the
     handler keeps its real event type from the map above. */
  const on = <K extends keyof EditorEventMap>(
    target: EventTarget, type: K,
    fn: (ev: EditorEventMap[K]) => void,
    opts?: boolean | AddEventListenerOptions,
  ): void => {
    target.addEventListener(type, fn as EventListener, opts);
    cleanups.push(() => target.removeEventListener(type, fn as EventListener, opts));
  };

  /* ---------- inserting ---------- */

  /* execCommand is deprecated but still the only API that inserts at
     the caret AND keeps the browser's native undo stack intact; its
     replacement isn't shipping anywhere yet. Range insertion is the
     fallback for engines that have dropped it. */
  function insertHtmlAtCaret(html: string): void {
    root.focus();
    if (document.queryCommandSupported?.("insertHTML")) {
      document.execCommand("insertHTML", false, html);
      return;
    }
    const sel = getSelection();
    const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
    const frag = document.createRange().createContextualFragment(html);
    if (range && root.contains(range.commonAncestorContainer)) {
      range.deleteContents();
      range.insertNode(frag);
    } else {
      root.append(frag);
    }
  }

  async function insertImages(files: FileList | File[]): Promise<void> {
    const images = [...files].filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    toast(images.length === 1 ? "Processing photo…" : `Processing ${images.length} photos…`);
    for (const file of images) {
      try {
        const img = await processImage(file);
        insertHtmlAtCaret(figureHtml(img, file.name.replace(/\.[a-z0-9]+$/i, "")));
      } catch {
        toast("That photo couldn't be read, try a JPG or PNG.");
      }
    }
    changed();
  }

  /* ---------- which block the caret is in ---------- */

  /** The top-level block the caret is in.

      An empty editor has no blocks at all, the first characters typed
      land in a bare text node parented to the editor itself, so that
      case returns the editor. Without it the markdown rules did nothing
      until the article already had a paragraph in it, which is to say
      they did nothing on the first line of every new piece. */
  function blockOf(node: Node | null | undefined): Element | null {
    let el: Node | null | undefined = node?.nodeType === Node.TEXT_NODE
      ? node.parentNode : node;
    if (el === root) return root;
    while (el && el !== root && el.parentNode !== root) el = el.parentNode;
    /* Always an element by here: the walk starts at a node's parent
       and every ancestor of a text node inside the editor is one. */
    return el instanceof Element && el !== root ? el : null;
  }

  const BLOCK_SEL = "p,h2,h3,ul,ol,blockquote,figure,hr,table,"
    + "div.note,div.ex,div.at-a-glance,div.side-note,div.figures,div.table-scroll";

  /** The outermost block the node sits in.

      Not blockOf(): that one answers "which child of the editor",
      which is a different question and a wrong one here, because a
      contenteditable quietly wraps things in bare <div>s of its own
      as you type and the answer becomes "all of it". This walks up
      to the outermost thing that is actually one of the article's
      blocks, so the first line of a list inside a glance box gives
      the glance box, and a stray wrapper gives nothing. */
  function outerBlock(node: Node | null | undefined): Element | null {
    let el: Node | null | undefined = node?.nodeType === Node.TEXT_NODE
      ? node.parentElement : node;
    let found: Element | null = null;
    while (el && el !== root) {
      if (el instanceof Element && el.matches(BLOCK_SEL)) found = el;
      el = el.parentElement;
    }
    return found;
  }

  /** Insert a block beside the one the caret is in, and put the
      caret where the writing goes. `data-fill` marks that spot; it
      never survives sanitize().

      This builds the nodes and places them itself rather than going
      through execCommand, which is the one place in this file where
      that is worth doing. execCommand normalises what it inserts
      against what is already there, and its idea of normal is not
      ours: a checklist inserted next to a numbered list had its
      items folded into that list and its class dropped, so the block
      silently did not appear. The cost is that this insertion is not
      on the browser's undo stack; the block is one Backspace from
      gone either way. */
  function insertBlockHtml(html: string): void {
    root.focus();
    const fragment = document.createRange().createContextualFragment(html);
    const added = [...fragment.children];
    const sel = getSelection();
    const here = sel?.rangeCount ? outerBlock(sel.getRangeAt(0).startContainer) : null;

    if (!here) {
      root.append(fragment);
    } else if (here.tagName === "P" && !(here.textContent ?? "").trim()) {
      // An empty paragraph is where the caret waits, not content.
      here.replaceWith(fragment);
    } else {
      here.after(fragment);
    }

    /* Somewhere to carry on typing, once, rather than a blank line
       per block for as long as you keep adding them. */
    const tail = added[added.length - 1];
    const next = tail?.nextElementSibling;
    if (tail && !(next?.tagName === "P" && !(next.textContent ?? "").trim())) {
      tail.after(Object.assign(document.createElement("p"), { innerHTML: "<br>" }));
    }

    const target = root.querySelector("[data-fill]");
    if (target) {
      target.removeAttribute("data-fill");
      getSelection()?.selectAllChildren(target);
    }
    changed();
  }

  /* `value ?? undefined` rather than the null this used to pass:
     WebIDL turns a null DOMString into the STRING "null", which
     every command here ignores and none of them wants. */
  const exec = (cmd: string, value: string | null = null) =>
    document.execCommand(cmd, false, value ?? undefined);

  /* ---------- the blocks a long read is made of ----------

     `label` is what the slash menu and the toolbar show, `hint` is
     the line under it, and `html` is what lands at the caret with
     `data-fill` marking where the writing starts.

     These exist because the travel piece needed all five and none
     of them could be made from inside the Studio: they were typed
     as raw HTML into the file by hand, which is exactly the thing
     this tool is for not doing. */
  const BLOCKS: Block[] = [
    { label: "Heading", hint: "Section heading", run: () => exec("formatBlock", "h2") },
    { label: "Sub-heading", hint: "Under a heading", run: () => exec("formatBlock", "h3") },
    { label: "Bullet list", hint: "Unordered", run: () => exec("insertUnorderedList") },
    { label: "Numbered list", hint: "Ordered", run: () => exec("insertOrderedList") },
    { label: "Quote", hint: "Pulled out, green rule", run: () => exec("formatBlock", "blockquote") },

    /* ---- the five from the travel piece ---- */
    { label: "At a glance", hint: "Gold box of quick answers", key: "at-a-glance",
      html: () => `<div class="at-a-glance"><p class="at-a-glance-label">${words().glance}</p>`
        + `<ul><li data-fill>${words().glanceItem}</li><li>…</li><li>…</li></ul></div>` },
    { label: "Key point", hint: "Note at the end of a part", key: "side-note",
      html: () => `<div class="side-note"><p class="side-note-label">${words().note}</p>`
        + `<p data-fill>${words().noteBody}</p></div>` },
    { label: "Steps", hint: "Numbered, in circles", key: "step-list",
      html: () => `<ol class="step-list"><li data-fill>${words().step}</li><li>…</li><li>…</li></ol>` },
    { label: "Checklist", hint: "Ticks, order doesn't matter", key: "checklist",
      html: () => `<ul class="checklist"><li data-fill>${words().check}</li><li>…</li><li>…</li></ul>` },
    { label: "Key figures", hint: "The two or three numbers", key: "figures",
      html: () => `<div class="figures">`
        + `<div class="fig"><strong data-fill>৳0</strong>${words().figure}</div>`
        + `<div class="fig"><strong>0</strong>…</div>`
        + `<div class="fig"><strong>0</strong>…</div></div>` },

    { label: "Note", hint: "Gold-edged aside", key: "note",
      html: () => `<div class="note" data-fill>${words().flag}</div>` },
    { label: "Example", hint: "Tinted worked example", key: "ex",
      html: () => `<div class="ex" data-fill>${words().example}</div>` },
    { label: "Table", hint: "Scrolls on a phone", run: () => insertBlockHtml(TABLE_SKELETON) },
    { label: "Divider", hint: "Horizontal rule", run: () => insertBlockHtml("<hr>") },
    { label: "Photo", hint: "Resized and re-encoded", run: () => pickPhoto() },
  ];

  /** Every block can be run the same way, whether it brought a
      function or a piece of markup. */
  const runBlock = (block: Block): void => {
    if (block.run) block.run();
    else if (block.html) insertBlockHtml(block.html());
  };
  const blockByKey = (key: string): Block | undefined => BLOCKS.find((b) => b.key === key);

  /* ---------- paste, drop, and the caption hint ---------- */

  on(root, "paste", (e) => {
    const cd = e.clipboardData;
    if (!cd) return;
    e.preventDefault();

    if (cd.files?.length) {           // a screenshot or a photo
      insertImages(cd.files);
      return;
    }
    const html = cd.getData("text/html");
    const text = cd.getData("text/plain");
    insertHtmlAtCaret(html ? sanitize(html) : textToHtml(text));
    changed();
  });

  // drag photos straight onto the page
  (["dragenter", "dragover"] as const).forEach((ev) =>
    on(root, ev, (e) => {
      if (!e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      root.classList.add("drop-target");
    })
  );
  (["dragleave", "drop"] as const).forEach((ev) =>
    on(root, ev, () => root.classList.remove("drop-target"))
  );
  on(root, "drop", (e) => {
    if (!e.dataTransfer?.files.length) return;
    e.preventDefault();
    insertImages(e.dataTransfer.files);
  });

  /* A caption still holding the prompt is selected whole, so the
     first thing typed replaces it rather than joining it.

     TWO EVENTS, and `focusin` alone was the bug. It fires on
     mousedown, and the browser then puts the caret where the
     pointer landed on mouseup, which collapses the selection this
     just made. So clicking into a caption, which is how everybody
     reaches one, left the prompt in place and the writer typed
     into the middle of it. `focusin` is still here because it is
     the one that serves Tab and programmatic focus.

     A drag is left alone: a selection that is not collapsed was
     chosen on purpose. */
  const takeCaption = (node: EventTarget | null): void => {
    const cap = node instanceof Element ? node.closest("figcaption") : null;
    if (cap && (cap.textContent ?? "").startsWith(CAPTION_HINT)) {
      getSelection()?.selectAllChildren(cap);
    }
  };
  on(root, "focusin", (e) => takeCaption(e.target));
  on(root, "mouseup", (e) => {
    const sel = getSelection();
    if (sel && !sel.isCollapsed) return;
    takeCaption(e.target);
  });

  on(root, "input", changed);

  /* ---------- markdown, for the shapes people type anyway ---------- */

  const INPUT_RULES: Array<{ re: RegExp; run: () => void }> = [
    { re: /^#{1,2}$/, run: () => exec("formatBlock", "h2") },
    { re: /^#{3,6}$/, run: () => exec("formatBlock", "h3") },
    { re: /^[-*+]$/, run: () => exec("insertUnorderedList") },
    { re: /^1[.)]$/, run: () => exec("insertOrderedList") },
    { re: /^>$/, run: () => exec("formatBlock", "blockquote") },
    { re: /^---$/, run: () => insertBlockHtml("<hr>") },
  ];

  on(root, "input", (e) => {
    if (e.inputType !== "insertText" || e.data !== " ") return;

    const sel = getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (!(node instanceof Text)) return;

    // The marker, without the space that just triggered this.
    const marker = node.data.slice(0, range.startOffset - 1);
    if (!blockOf(node)) return;

    // Only at the very start of a block: "1." mid-sentence is a
    // sentence, not a list. A <br> in front is the empty paragraph the
    // browser leaves behind, not content.
    const prev = node.previousSibling;
    const atStart = range.startOffset - marker.length - 1 === 0
      && (!prev || prev.nodeName === "BR");
    if (!atStart) return;

    const rule = INPUT_RULES.find((r) => r.re.test(marker));
    if (!rule) return;

    const kill = document.createRange();
    kill.setStart(node, range.startOffset - marker.length - 1);
    kill.setEnd(node, range.startOffset);
    kill.deleteContents();

    /* formatBlock needs a block to replace, and bare text in an empty
       editor has none: it silently does nothing, which is why "##"
       worked on the second line and not the first. The list commands
       build their own container, so they never noticed. */
    if (node.parentNode === root) {
      const p = document.createElement("p");
      node.replaceWith(p);
      p.append(node);
      const caret = document.createRange();
      caret.setStart(node, 0);
      caret.collapse(true);
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(caret);
    }

    rule.run();
    changed();
  });

  /* ---------- the slash menu ---------- */

  /** Where the "/" was typed, or null when the menu is shut. */
  let slash: { node: Node; offset: number } | null = null;
  const slashMenu = Object.assign(document.createElement("div"), { className: "slash-menu" });
  slashMenu.hidden = true;
  slashMenu.setAttribute("role", "listbox");
  slashMenu.setAttribute("aria-label", "Insert a block");
  document.body.append(slashMenu);
  cleanups.push(() => slashMenu.remove());

  let slashIndex = 0;
  let slashShown: Block[] = [];

  function closeSlash(): void {
    slash = null;
    slashMenu.hidden = true;
    slashMenu.replaceChildren();
  }

  function caretRect(): DOMRect | null {
    const sel = getSelection();
    if (!sel?.rangeCount) return null;
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    // A collapsed caret in an empty block measures 0x0, so fall back
    // to the block itself.
    if (rect.width || rect.height || rect.top) return rect;
    return blockOf(sel.getRangeAt(0).startContainer)?.getBoundingClientRect() ?? null;
  }

  function drawSlash(query: string): void {
    slashShown = BLOCKS.filter((b) => b.label.toLowerCase().includes(query.toLowerCase()));
    if (!slashShown.length) { closeSlash(); return; }
    slashIndex = Math.min(slashIndex, slashShown.length - 1);

    slashMenu.replaceChildren(...slashShown.map((item, i) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "slash-item";
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", String(i === slashIndex));
      row.append(
        Object.assign(document.createElement("span"), { textContent: item.label }),
        Object.assign(document.createElement("span"), { className: "mono", textContent: item.hint })
      );
      // mousedown, not click: click would land after the editor has
      // already lost the selection the block is about to be inserted at.
      row.addEventListener("mousedown", (e) => { e.preventDefault(); runSlash(i); });
      return row;
    }));

    const rect = caretRect();
    if (rect) {
      slashMenu.style.left = `${Math.min(rect.left, innerWidth - 280)}px`;
      slashMenu.style.top = `${rect.bottom + 6}px`;
    }
    slashMenu.hidden = false;
  }

  function runSlash(index: number): void {
    const item = slashShown[index];
    if (!item || !slash) return;

    // Delete the "/" and whatever was typed after it.
    const sel = getSelection();
    const caret = sel?.rangeCount ? sel.getRangeAt(0) : null;
    if (caret && caret.startContainer === slash.node) {
      const kill = document.createRange();
      kill.setStart(slash.node, slash.offset);
      kill.setEnd(caret.startContainer, caret.startOffset);
      kill.deleteContents();
    }
    closeSlash();
    root.focus();
    runBlock(item);
    changed();
  }

  on(root, "input", (e) => {
    if (e.inputType === "insertText" && e.data === "/") {
      const sel = getSelection();
      const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
      if (range?.startContainer.nodeType === Node.TEXT_NODE) {
        const text = range.startContainer.textContent ?? "";
        const before = text[range.startOffset - 2];
        // Only where a new word starts, so a URL doesn't open the menu.
        if (before === undefined || /\s/.test(before)) {
          slash = { node: range.startContainer, offset: range.startOffset - 1 };
          slashIndex = 0;
          drawSlash("");
          return;
        }
      }
    }

    if (!slash) return;

    // Keep the query in step with what's been typed since the slash.
    const sel = getSelection();
    const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
    if (!range || range.startContainer !== slash.node || range.startOffset <= slash.offset) {
      closeSlash();
      return;
    }
    const query = (slash.node.textContent ?? "").slice(slash.offset + 1, range.startOffset);
    if (/\s/.test(query)) { closeSlash(); return; }
    drawSlash(query);
  });

  on(root, "keydown", (e) => {
    if (!slash || slashMenu.hidden) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      slashIndex = (slashIndex + (e.key === "ArrowDown" ? 1 : -1) + slashShown.length) % slashShown.length;
      drawSlash((slash.node.textContent ?? "")
        .slice(slash.offset + 1, getSelection()?.getRangeAt(0).startOffset));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      runSlash(slashIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSlash();
    }
  });

  on(root, "blur", () => setTimeout(closeSlash, 120));

  /* ---------- the figure toolbar ----------
     Alt text had no way in at all: it was set once from the file name
     and never editable, which is why pre-flight could warn about it
     and offer nothing to do about it. */

  const figBar = Object.assign(document.createElement("div"), { className: "fig-bar" });
  figBar.hidden = true;
  document.body.append(figBar);
  cleanups.push(() => figBar.remove());

  let activeFigure: HTMLImageElement | null = null;

  function hideFigBar(): void {
    activeFigure = null;
    figBar.hidden = true;
  }

  /** Set one class out of a set, or none of them. */
  function setFromSet(figure: Element, set: FigSet, wanted: string): void {
    set.forEach(([cls]) => { if (cls) figure.classList.remove(cls); });
    if (wanted) figure.classList.add(wanted);
  }

  const chosenFrom = (figure: Element, set: FigSet): string =>
    set.find(([cls]) => cls && figure.classList.contains(cls))?.[0] ?? "";

  function showFigBar(img: HTMLImageElement): void {
    activeFigure = img;
    const figure = img.closest("figure");

    const chip = (
      label: string, pressed: boolean | null, onClick: () => void, title?: string,
    ): HTMLButtonElement => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = label;
      if (title) b.title = title;
      if (pressed !== null) b.setAttribute("aria-pressed", String(pressed));
      b.addEventListener("mousedown", (e) => { e.preventDefault(); onClick(); });
      return b;
    };

    /** One labelled row of mutually exclusive chips. */
    const group = (name: string, set: FigSet): HTMLElement | null => {
      if (!figure) return null;
      const chosen = chosenFrom(figure, set);
      const row = document.createElement("span");
      row.className = "fig-group";
      row.append(
        Object.assign(document.createElement("span"), { className: "mono", textContent: name }),
        ...set.map(([cls, label, hint]) =>
          chip(label, cls === chosen, () => {
            setFromSet(figure, set, cls);
            changed();
            showFigBar(img);
          }, hint))
      );
      return row;
    };

    const lead = !!figure?.classList.contains("lead-photo");

    /* Filtered, and the filter is not tidiness. `group()` answers
       null for an <img> with no <figure> round it, which a pasted
       photo is, and replaceChildren turns a null into the STRING
       "null": the bar read "null null null Alt Remove". */
    figBar.replaceChildren(...[
      group("Size", FIG_SIZES),
      group("Shape", FIG_FRAMES),
      /* Which part to keep. It only does anything once the photo is
         being cropped, either by a frame here or by the 1200x630
         share card, so it says so rather than sitting there inert. */
      group("Keep", FIG_FOCUS),
      chip(img.getAttribute("alt")?.trim() ? "Alt ✓" : "Alt", null, () => {
        const alt = prompt("Describe the photo for a screen reader:", img.getAttribute("alt") ?? "");
        if (alt !== null) { img.setAttribute("alt", alt.trim()); changed(); showFigBar(img); }
      }, "What a screen reader says instead of showing it"),
      figure ? chip(lead ? "Lead ✓" : "Lead", lead, () => {
        /* One lead photo per piece: it is the one the share card is
           made from, and two of them is a question with no answer. */
        if (!lead) {
          root.querySelectorAll("figure.lead-photo")
            .forEach((f) => f.classList.remove("lead-photo"));
        }
        figure.classList.toggle("lead-photo", !lead);
        changed();
        showFigBar(img);
      }, "Use this one for the social share card") : null,
      chip("Remove", null, () => {
        if (!confirm("Remove this photo?")) return;
        (figure ?? img).remove();
        hideFigBar();
        changed();
      }),
    ].filter((node): node is HTMLElement => node !== null));

    const rect = img.getBoundingClientRect();
    /* Above the photo if there is room, below it if the photo starts
       at the top of the pane. The bar grew from four chips to twelve
       and can no longer assume it fits in the left half either. */
    const width = figBar.offsetWidth || 420;
    figBar.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - width - 8))}px`;
    figBar.style.top = rect.top > 60
      ? `${rect.top - 44}px`
      : `${Math.min(rect.bottom + 8, innerHeight - 52)}px`;
    figBar.hidden = false;
  }

  on(root, "click", (e) => {
    const img = e.target instanceof Element ? e.target.closest("img") : null;
    if (img) showFigBar(img);
    else hideFigBar();
  });
  on(window, "scroll", () => { if (activeFigure) showFigBar(activeFigure); }, { passive: true });

  /* ---------- keyboard ---------- */

  on(root, "keydown", (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    const key = e.key.toLowerCase();

    if (key === "k") {
      // The site binds Ctrl+K to search, on window. Inside the editor a
      // link is the more useful thing, so this stops it bubbling there.
      e.preventDefault();
      e.stopPropagation();
      link();
      return;
    }

    if (key === "s" && onSave) {
      e.preventDefault();
      onSave();
      return;
    }

    if (key === "enter" && onPublish) {
      e.preventDefault();
      onPublish();
    }
  });

  /** Ask for a URL and wrap the selection in it. */
  function link(): void {
    const url = prompt("Link to which URL?", "https://");
    if (url) exec("createLink", url);
    changed();
  }

  /* ---------- what the page is handed ---------- */

  return {
    /** The blocks, for a toolbar that wants to draw its own buttons. */
    blocks: BLOCKS,
    run: runBlock,
    byKey: blockByKey,

    insertImages,
    insertHtmlAtCaret,
    insertBlockHtml,
    link,

    /** A formatting command straight through to the browser. */
    command(cmd: string, value: string | null = null) {
      root.focus();
      exec(cmd, value);
      changed();
    },

    html: () => root.innerHTML,
    setHtml(value: string) {
      root.innerHTML = value ?? "";
      hideFigBar();
      closeSlash();
    },
    clear() {
      root.replaceChildren();
      hideFigBar();
      closeSlash();
    },
    focus: () => root.focus(),

    /** Take every listener, the slash menu and the figure bar back
        off the page. React unmounts; the old Studio never did. */
    destroy() {
      cleanups.forEach((off) => off());
      cleanups.length = 0;
    },
  };
}
