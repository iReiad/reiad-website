/* ============================================================
   studio.js — the Article Studio.

   Paste an article (from Word, Google Docs, Notion, an email,
   anywhere) and paste or drop the photos. The Studio:

     · strips the pasted mess down to clean semantic HTML
     · resizes every photo and re-encodes it as WebP
     · shows a live preview in the real article styles
     · exports a finished page you drop into /insights/
     · hands you the one line to paste into content.js

   No build step, no server, no dependencies. Everything runs
   in the browser; drafts autosave to IndexedDB so a closed tab
   costs you nothing.
   ============================================================ */

import { toast, copyText, download } from "/app.js";
import { lock } from "/auth.js";
import { api, uploadMedia, notion } from "/api.js";
import { mountDashboard } from "/admin.js";

/* ============================================================
   Elements
   ============================================================ */
const $ = (sel) => document.querySelector(sel);

const editor = $("#editor");
const preview = $("#preview");
const fields = {
  title: $("#f-title"),
  dek: $("#f-dek"),
  tag: $("#f-tag"),
  slug: $("#f-slug"),
  date: $("#f-date"),
  lang: $("#f-lang"),
};
const meterBar = $("#meter-bar");
const meterText = $("#meter-text");
const statLine = $("#stat-line");
const draftLine = $("#draft-line");
const nowLine = $("#now-line");

/* What the editor currently holds. `slug` is set once a piece has
   been saved to the database, and is what tells a republish from a
   first publish — without it, editing a live article and pressing
   publish would look exactly like a slug collision. */
const current = {
  draftId: null,
  slug: null,
  notionPageId: null,
};

/* Set by enableDynamic(); everything server-shaped checks it first
   so the Studio still runs as a pure export tool without a backend. */
let dynamic = false;

/* ============================================================
   1. SANITISER — the pasted-HTML gauntlet
   ============================================================ */

const KEEP = new Set([
  "P", "H2", "H3", "UL", "OL", "LI", "BLOCKQUOTE", "STRONG", "EM", "A", "BR",
  "FIGURE", "FIGCAPTION", "IMG", "HR", "CODE", "TABLE", "THEAD", "TBODY",
  "TR", "TH", "TD", "SUP", "SUB",
]);

/* Word/Docs/Notion synonyms → the tag we actually want */
const RENAME = {
  H1: "H2", H4: "H3", H5: "H3", H6: "H3",
  B: "STRONG", I: "EM", U: "EM", MARK: "EM",
  DIV: "P", SECTION: "P", ARTICLE: "P", SPAN: "P", FONT: "P", PRE: "P",
};

const ATTRS = {
  A: ["href", "title"],
  IMG: ["src", "alt", "width", "height"],
  TD: ["colspan", "rowspan"],
  TH: ["colspan", "rowspan"],
};

/* The class names the stylesheet actually knows about — the same list
   _lib/sanitise.js enforces server-side.

   Without this the two sanitisers disagreed, and the browser's was
   the stricter one: a <div class="note"> became a plain paragraph and
   figure.wide lost its class on the way out of the editor. Which
   meant the server's support for these was unreachable from the one
   tool that writes to it, and every callout imported from Notion
   arrived flattened. */
const KEEP_CLASSES = new Set([
  "wide", "duo", "table-scroll", "term", "note", "ex", "lead-photo",
]);

const keptClasses = (node) =>
  [...(node.classList ?? [])].filter((c) => KEEP_CLASSES.has(c));

/** Turn arbitrary HTML into the small set of tags the site styles. */
export function sanitize(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

  doc.body.querySelectorAll("script, style, meta, link, iframe, object, embed, form, input, button")
    .forEach((n) => n.remove());

  const walk = (node) => {
    [...node.children].forEach(walk);

    let tag = node.tagName;
    const classes = keptClasses(node);

    // A div is stray markup from whatever produced the paste, unless
    // it carries one of the site's own class names — then it is a
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
    if (!node.textContent.trim() && !node.querySelector("img, hr, br")
        && /^(P|H2|H3|LI|BLOCKQUOTE|FIGCAPTION)$/.test(tag)) {
      node.remove();
    }
  };

  [...doc.body.children].forEach(walk);

  // bare text at the top level becomes a paragraph
  [...doc.body.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
      const p = doc.createElement("p");
      p.textContent = n.textContent.trim();
      n.replaceWith(p);
    }
  });

  // whitespace between blocks is the pasting app's indentation, not content
  [...doc.body.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
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
function textToHtml(text) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ============================================================
   2. PHOTOS (resize, re-encode, embed
   ============================================================ */

const MAX_EDGE = 1600;      // px on the long side) plenty for a blog
const QUALITY = 0.82;

/** File/Blob → a downscaled WebP blob, stripped of EXIF.
    The single place that decides what a photo on this site weighs —
    both the editor and the /media uploader come through here. */
async function encodeImage(source) {
  const bitmap = await createImageBitmap(source);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  let blob = await canvas.convertToBlob({ type: "image/webp", quality: QUALITY });
  // Safari used to hand back a PNG here; JPEG is the safer second choice.
  if (blob.type !== "image/webp") {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.85 });
  }
  return { blob, width: w, height: h };
}

/** The same thing as a data URL, for the editor's own preview. */
async function processImage(file) {
  const { blob, width, height } = await encodeImage(file);
  return { url: await blobToDataURL(blob), width, height, type: blob.type };
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

/** Build the <figure> we insert into the editor. */
function figureHtml({ url, width, height }, alt = "") {
  return `<figure><img src="${url}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async"><figcaption>Caption: click to edit, or delete this line</figcaption></figure><p><br></p>`;
}

async function insertImages(files) {
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
  onEdit();
}

/* ---------- moving photos out of the article and into /media ----------

   A photo can arrive three ways: pasted (a data: URL), imported from
   Notion (a URL on our own asset proxy, valid for about an hour), or
   already hosted. Only the third kind can be published, so this
   turns the other two into it.

   It runs before every publish, and it writes its result back into
   the editor: leaving the data URLs in place would mean re-uploading
   the same photos on the next save, and would keep the draft in
   IndexedDB megabytes larger than it needs to be. */

const ALREADY_HOSTED = /^\/media\//;

async function hostPhotos(html, slug, onProgress) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const pending = [...doc.querySelectorAll("img")].filter((img) => {
    const src = img.getAttribute("src") ?? "";
    return src && !ALREADY_HOSTED.test(src);
  });

  if (!pending.length) return { html, uploaded: 0, failed: 0 };

  let uploaded = 0;
  let failed = 0;

  for (const [i, img] of pending.entries()) {
    onProgress?.(i + 1, pending.length);
    try {
      // Same-origin for both kinds: a data: URL, or our own proxy,
      // which needs the session cookie to answer at all.
      const res = await fetch(img.getAttribute("src"), { credentials: "same-origin" });
      if (!res.ok) throw new Error(String(res.status));

      const { blob, width, height } = await encodeImage(await res.blob());
      const stored = await uploadMedia(blob, slug);
      if (!stored?.url) throw new Error(stored?.reason ?? "upload-failed");

      img.setAttribute("src", stored.url);
      img.setAttribute("width", String(width));
      img.setAttribute("height", String(height));
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      uploaded++;
    } catch (err) {
      // Leave the photo where it is and report it. A failed upload
      // must not quietly drop a picture out of the article.
      console.warn("photo upload failed", err);
      failed++;
    }
  }

  return { html: doc.body.innerHTML, uploaded, failed };
}

/* ============================================================
   3. EDITOR
   ============================================================ */

/* execCommand is deprecated but still the only API that inserts at the
   caret AND keeps the browser's native undo stack intact; its
   replacement isn't shipping anywhere yet. Range insertion is the
   fallback for engines that have dropped it. */
function insertHtmlAtCaret(html) {
  editor.focus();
  if (document.queryCommandSupported?.("insertHTML")) {
    document.execCommand("insertHTML", false, html);
    return;
  }
  const sel = getSelection();
  const range = sel.rangeCount ? sel.getRangeAt(0) : null;
  const frag = document.createRange().createContextualFragment(html);
  if (range && editor.contains(range.commonAncestorContainer)) {
    range.deleteContents();
    range.insertNode(frag);
  } else {
    editor.append(frag);
  }
}

editor.addEventListener("paste", (e) => {
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
  onEdit();
});

// drag photos straight onto the page
["dragenter", "dragover"].forEach((ev) =>
  editor.addEventListener(ev, (e) => {
    if (!e.dataTransfer?.types.includes("Files")) return;
    e.preventDefault();
    editor.classList.add("drop-target");
  })
);
["dragleave", "drop"].forEach((ev) =>
  editor.addEventListener(ev, () => editor.classList.remove("drop-target"))
);
editor.addEventListener("drop", (e) => {
  if (!e.dataTransfer?.files.length) return;
  e.preventDefault();
  insertImages(e.dataTransfer.files);
});

// caption fields shouldn't inherit the caption text when you type
editor.addEventListener("focusin", (e) => {
  const cap = e.target.closest?.("figcaption");
  if (cap && cap.textContent.startsWith("Caption: click to edit")) {
    getSelection().selectAllChildren(cap);
  }
});

editor.addEventListener("input", onEdit);

/* ---------- formatting toolbar ---------- */
document.querySelectorAll("[data-cmd]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const { cmd, value } = btn.dataset;
    editor.focus();
    if (cmd === "link") {
      const url = prompt("Link to which URL?", "https://");
      if (url) document.execCommand("createLink", false, url);
    } else {
      document.execCommand(cmd, false, value ?? null);
    }
    onEdit();
  });
});

$("#add-photo").addEventListener("click", () => $("#photo-input").click());
$("#photo-input").addEventListener("change", (e) => {
  insertImages(e.target.files);
  e.target.value = "";
});

/* ============================================================
   3b. BLOCKS AT THE CARET

   The site's article vocabulary is small and specific — a note box,
   a worked example, a wide figure, a table that scrolls on a phone —
   and until now the only way to get one was to write the HTML by
   hand and paste it in. These put the whole set a slash away, and
   the markdown rules cover the shapes people type out of habit.
   ============================================================ */

/** The top-level block the caret is in.

    An empty editor has no blocks at all — the first characters typed
    land in a bare text node parented to the editor itself — so that
    case returns the editor. Without it the markdown rules did nothing
    until the article already had a paragraph in it, which is to say
    they did nothing on the first line of every new piece. */
function blockOf(node) {
  let el = node?.nodeType === Node.TEXT_NODE ? node.parentNode : node;
  if (el === editor) return editor;
  while (el && el !== editor && el.parentNode !== editor) el = el.parentNode;
  return el && el !== editor ? el : null;
}

/** Insert a block and put the caret where the writing goes.
    `data-fill` marks that spot; it never survives sanitize(). */
function insertBlockHtml(html) {
  insertHtmlAtCaret(html);
  const target = editor.querySelector("[data-fill]");
  if (target) {
    target.removeAttribute("data-fill");
    getSelection().selectAllChildren(target);
  }
  onEdit();
}

const exec = (cmd, value = null) => document.execCommand(cmd, false, value);

const TABLE_SKELETON =
  '<div class="table-scroll"><table><thead><tr>'
  + "<th data-fill>Column</th><th>Column</th><th>Column</th></tr></thead><tbody>"
  + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"
  + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"
  + "</tbody></table></div><p><br></p>";

const BLOCKS = [
  { label: "Heading", hint: "Section heading", run: () => exec("formatBlock", "h2") },
  { label: "Sub-heading", hint: "Under a heading", run: () => exec("formatBlock", "h3") },
  { label: "Bullet list", hint: "Unordered", run: () => exec("insertUnorderedList") },
  { label: "Numbered list", hint: "Ordered", run: () => exec("insertOrderedList") },
  { label: "Quote", hint: "Pulled out, green rule", run: () => exec("formatBlock", "blockquote") },
  { label: "Note", hint: "Gold-edged aside",
    run: () => insertBlockHtml('<div class="note" data-fill>Something worth flagging.</div><p><br></p>') },
  { label: "Example", hint: "Tinted worked example",
    run: () => insertBlockHtml('<div class="ex" data-fill>A worked example.</div><p><br></p>') },
  { label: "Table", hint: "Scrolls on a phone", run: () => insertBlockHtml(TABLE_SKELETON) },
  { label: "Divider", hint: "Horizontal rule", run: () => insertBlockHtml("<hr><p><br></p>") },
  { label: "Photo", hint: "Resized and re-encoded", run: () => $("#photo-input").click() },
];

/* ---------- markdown, for the shapes people type anyway ---------- */

const INPUT_RULES = [
  { re: /^#{1,2}$/, run: () => exec("formatBlock", "h2") },
  { re: /^#{3,6}$/, run: () => exec("formatBlock", "h3") },
  { re: /^[-*+]$/, run: () => exec("insertUnorderedList") },
  { re: /^1[.)]$/, run: () => exec("insertOrderedList") },
  { re: /^>$/, run: () => exec("formatBlock", "blockquote") },
  { re: /^---$/, run: () => insertBlockHtml("<hr><p><br></p>") },
];

editor.addEventListener("input", (e) => {
  if (e.inputType !== "insertText" || e.data !== " ") return;

  const sel = getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return;

  // The marker, without the space that just triggered this.
  const marker = node.textContent.slice(0, range.startOffset - 1);
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
     editor has none — it silently does nothing, which is why "##"
     worked on the second line and not the first. The list commands
     build their own container, so they never noticed. */
  if (node.parentNode === editor) {
    const p = document.createElement("p");
    node.replaceWith(p);
    p.append(node);
    const caret = document.createRange();
    caret.setStart(node, 0);
    caret.collapse(true);
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(caret);
  }

  rule.run();
  onEdit();
});

/* ---------- the slash menu ---------- */

let slash = null;          // { node, offset } where the "/" was typed
const slashMenu = Object.assign(document.createElement("div"), { className: "slash-menu" });
slashMenu.hidden = true;
slashMenu.setAttribute("role", "listbox");
slashMenu.setAttribute("aria-label", "Insert a block");
document.body.append(slashMenu);

let slashIndex = 0;
let slashShown = [];

function closeSlash() {
  slash = null;
  slashMenu.hidden = true;
  slashMenu.replaceChildren();
}

function drawSlash(query) {
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

function caretRect() {
  const sel = getSelection();
  if (!sel.rangeCount) return null;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  // A collapsed caret in an empty block measures 0×0, so fall back to
  // the block itself.
  if (rect.width || rect.height || rect.top) return rect;
  return blockOf(sel.getRangeAt(0).startContainer)?.getBoundingClientRect() ?? null;
}

function runSlash(index) {
  const item = slashShown[index];
  if (!item || !slash) return;

  // Delete the "/" and whatever was typed after it.
  const sel = getSelection();
  const caret = sel.rangeCount ? sel.getRangeAt(0) : null;
  if (caret && caret.startContainer === slash.node) {
    const kill = document.createRange();
    kill.setStart(slash.node, slash.offset);
    kill.setEnd(caret.startContainer, caret.startOffset);
    kill.deleteContents();
  }
  closeSlash();
  editor.focus();
  item.run();
  onEdit();
}

editor.addEventListener("input", (e) => {
  if (e.inputType === "insertText" && e.data === "/") {
    const sel = getSelection();
    const range = sel.rangeCount ? sel.getRangeAt(0) : null;
    if (range?.startContainer.nodeType === Node.TEXT_NODE) {
      const text = range.startContainer.textContent;
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
  const range = sel.rangeCount ? sel.getRangeAt(0) : null;
  if (!range || range.startContainer !== slash.node || range.startOffset <= slash.offset) {
    closeSlash();
    return;
  }
  const query = slash.node.textContent.slice(slash.offset + 1, range.startOffset);
  if (/\s/.test(query)) { closeSlash(); return; }
  drawSlash(query);
});

editor.addEventListener("keydown", (e) => {
  if (!slash || slashMenu.hidden) return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    slashIndex = (slashIndex + (e.key === "ArrowDown" ? 1 : -1) + slashShown.length) % slashShown.length;
    drawSlash(slash.node.textContent.slice(slash.offset + 1, getSelection().getRangeAt(0).startOffset));
  } else if (e.key === "Enter" || e.key === "Tab") {
    e.preventDefault();
    runSlash(slashIndex);
  } else if (e.key === "Escape") {
    e.preventDefault();
    closeSlash();
  }
});

editor.addEventListener("blur", () => setTimeout(closeSlash, 120));

/* ---------- the figure toolbar ----------
   Alt text had no way in at all: it was set once from the file name
   and never editable, which is why pre-flight could warn about it
   and offer nothing to do about it. */

const figBar = Object.assign(document.createElement("div"), { className: "fig-bar" });
figBar.hidden = true;
document.body.append(figBar);

let activeFigure = null;

function hideFigBar() {
  activeFigure = null;
  figBar.hidden = true;
}

function showFigBar(img) {
  activeFigure = img;
  const figure = img.closest("figure");

  const chip = (label, pressed, onClick) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    if (pressed !== null) b.setAttribute("aria-pressed", String(pressed));
    b.addEventListener("mousedown", (e) => { e.preventDefault(); onClick(); });
    return b;
  };

  const toggle = (cls) => {
    if (!figure) return;
    figure.classList.toggle(cls);
    onEdit();
    showFigBar(img);
  };

  figBar.replaceChildren(
    chip(img.getAttribute("alt")?.trim() ? "Alt text ✓" : "Alt text", null, () => {
      const alt = prompt("Describe the photo for a screen reader:", img.getAttribute("alt") ?? "");
      if (alt !== null) { img.setAttribute("alt", alt.trim()); onEdit(); showFigBar(img); }
    }),
    figure ? chip("Wide", figure.classList.contains("wide"), () => toggle("wide")) : null,
    figure ? chip("Lead", figure.classList.contains("lead-photo"), () => toggle("lead-photo")) : null,
    chip("Remove", null, () => {
      if (!confirm("Remove this photo?")) return;
      (figure ?? img).remove();
      hideFigBar();
      onEdit();
    })
  );

  const rect = img.getBoundingClientRect();
  figBar.style.left = `${Math.max(8, rect.left)}px`;
  figBar.style.top = `${Math.max(8, rect.top - 42)}px`;
  figBar.hidden = false;
}

editor.addEventListener("click", (e) => {
  const img = e.target.closest?.("img");
  if (img) showFigBar(img);
  else hideFigBar();
});
addEventListener("scroll", () => { if (activeFigure) showFigBar(activeFigure); }, { passive: true });

/* ---------- keyboard ---------- */

editor.addEventListener("keydown", (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (!mod) return;
  const key = e.key.toLowerCase();

  if (key === "k") {
    // The site binds Ctrl+K to search, on window. Inside the editor a
    // link is the more useful thing, so this stops it bubbling there.
    e.preventDefault();
    e.stopPropagation();
    const url = prompt("Link to which URL?", "https://");
    if (url) exec("createLink", url);
    onEdit();
    return;
  }

  if (key === "s") {
    e.preventDefault();
    saveDraft();
    toast("Draft saved on this device.");
    return;
  }

  if (key === "enter") {
    e.preventDefault();
    const publish = $("#btn-publish");
    if (dynamic && publish && !publish.hidden && !publish.disabled) publish.click();
    else $("#btn-html").click();
  }
});

/* ============================================================
   4. BUILDING THE ARTICLE
   ============================================================ */

function slugify(s) {
  const words = s
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

function readingStats(html) {
  const text = new DOMParser()
    .parseFromString(html, "text/html").body.textContent || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const photos = (html.match(/<img\b/gi) || []).length;
  return { words, photos, minutes: Math.max(1, Math.round(words / 200)) };
}

const CAPTION_HINT = "Caption: click to edit";

/** Captions the writer never touched shouldn't ship. */
function dropUntouchedCaptions(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("figcaption").forEach((c) => {
    if (c.textContent.trim().startsWith(CAPTION_HINT)) c.remove();
  });
  return doc.body.innerHTML;
}

function meta() {
  const title = fields.title.value.trim() || "Untitled article";
  const lang = fields.lang.value;
  const body = dropUntouchedCaptions(sanitize(editor.innerHTML));
  const stats = readingStats(body);
  return {
    title,
    dek: fields.dek.value.trim(),
    tag: fields.tag.value.trim() || "Note",
    slug: fields.slug.value.trim() || slugify(title),
    date: fields.date.value || new Date().toISOString().slice(0, 10),
    lang,
    body,
    ...stats,
  };
}

const FONTS =
  "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@400;500&family=Noto+Serif+Bengali:wght@500;600&display=swap";

/** The finished, standalone page — same chrome as every other page. */
function buildPage(m) {
  const dateLabel = new Intl.DateTimeFormat(m.lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${m.date}T00:00:00Z`));

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: m.title,
    description: m.dek,
    datePublished: m.date,
    inLanguage: m.lang,
    author: { "@type": "Person", name: "Rony Reiad", url: "https://reiad.co.uk/about.html" },
    mainEntityOfPage: `https://reiad.co.uk/insights/${m.slug}.html`,
  }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="${m.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(m.title)} · Rony Reiad</title>
  <meta name="description" content="${escapeHtml(m.dek)}">
  <link rel="canonical" href="https://reiad.co.uk/insights/${m.slug}.html">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(m.title)}">
  <meta property="og:description" content="${escapeHtml(m.dek)}">
  <meta property="og:url" content="https://reiad.co.uk/insights/${m.slug}.html">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Set the theme before first paint, so dark-mode readers
       never see a white flash. -->
  <script>
    (function () {
      var saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    })();
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0B3D2E">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <a class="skip" href="#main">Skip to the article</a>
  <div class="read-progress" aria-hidden="true"></div>

  <header>
    <div class="wrap header-inner">
      <a class="site-name" href="/index.html">
        <svg class="site-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor"/>
          <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor"/>
          <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor"/>
          <circle cx="63" cy="24" r="5.5" fill="currentColor"/>
        </svg>
        Rony Reiad
      </a>
      <nav aria-label="Main">
        <a href="/learn/index.html" data-keep>Learn</a>
        <a href="/insights.html" aria-current="page">Insights</a>
        <a href="/portfolio.html">Portfolio</a>
        <a href="/about.html">About</a>
        <a href="/contact.html" data-keep>Contact</a>
      </nav>
      <button class="icon-btn" id="open-palette" aria-label="Search the site (Ctrl+K)">⌕ <span class="kbd-hint">Ctrl K</span></button>
      <button class="icon-btn" id="theme-toggle" aria-label="Switch between light and dark mode">◐</button>
    </div>
  </header>

  <main id="main">
    <article class="wrap article">

      <span class="eyebrow mono">${escapeHtml(m.tag)}</span>
      <h1>${escapeHtml(m.title)}</h1>
      ${m.dek ? `<p class="lede">${escapeHtml(m.dek)}</p>` : ""}
      <p class="byline mono">
        <span>Rony Reiad</span><span class="dot"></span>
        <time datetime="${m.date}">${dateLabel}</time><span class="dot"></span>
        <span>${m.minutes} min read</span>
      </p>

${indent(m.body, 6)}

      <div class="note">
        This piece is general education, not investment advice. Rules, rates and
        fees change, confirm the current details with the relevant institution
        before acting on anything here.
      </div>

      <div class="prev-next">
        <a href="/insights.html">
          <span class="mono">All insights</span>
          <strong>Back to the index →</strong>
        </a>
        <a href="/learn/index.html">
          <span class="mono">শেখার লাইব্রেরি</span>
          <strong>Learn hub: বাংলায় →</strong>
        </a>
      </div>

    </article>
  </main>

  <footer>
    <div class="wrap">
      <span class="mono">Rony Reiad · Finance &amp; Bangladesh markets</span>
      <p>Everything on this site is general education, not investment advice.
         Do your own research before putting money anywhere.</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <script type="module" src="/app.js"></script>
</body>
</html>
`;
}

function indent(html, spaces) {
  const pad = " ".repeat(spaces);
  return html.split("\n").map((l) => (l.trim() ? pad + l : l)).join("\n");
}

/** The one line to paste into content.js */
function indexEntry(m) {
  return `  {
    slug: ${JSON.stringify(m.slug)},
    title: ${JSON.stringify(m.title)},
    dek: ${JSON.stringify(m.dek)},
    tag: ${JSON.stringify(m.tag)},
    date: ${JSON.stringify(m.date)},
    minutes: ${m.minutes},
    lang: ${JSON.stringify(m.lang)},
    status: "live",
  },`;
}

/* ============================================================
   5. LIVE PREVIEW + METERS
   ============================================================ */

let previewTimer;
function onEdit() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    renderPreview();
    saveDraft();
  }, 200);
}

function renderPreview() {
  const m = meta();
  const dateLabel = new Intl.DateTimeFormat(m.lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${m.date}T00:00:00Z`));

  preview.lang = m.lang;
  preview.innerHTML = `
    <article class="article">
      <span class="eyebrow mono">${escapeHtml(m.tag)}</span>
      <h1>${escapeHtml(m.title)}</h1>
      ${m.dek ? `<p class="lede">${escapeHtml(m.dek)}</p>` : ""}
      <p class="byline mono"><span>Rony Reiad</span><span class="dot"></span>
        <time>${dateLabel}</time><span class="dot"></span><span>${m.minutes} min read</span></p>
      ${m.body || '<p class="muted"><em>Your article will appear here as you paste it.</em></p>'}
    </article>`;

  statLine.textContent =
    `${m.words} word${m.words === 1 ? "" : "s"} · ${m.minutes} min read · ${m.photos} photo${m.photos === 1 ? "" : "s"}`;

  // page-weight meter: data-URL photos are ~4/3 their byte size
  const bytes = new Blob([buildPage(m)]).size;
  const kb = Math.round(bytes / 1024);
  const pct = Math.min(100, (bytes / (2 * 1024 * 1024)) * 100);
  meterBar.style.width = `${pct}%`;
  meterText.textContent = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB page` : `${kb} KB page`;
  const state = bytes > 2e6 ? "over" : bytes > 1e6 ? "warn" : "ok";
  meterText.closest(".studio-meter").dataset.state = state;

  if (!fields.slug.value.trim() && fields.title.value.trim()) {
    fields.slug.placeholder = slugify(fields.title.value);
  }

  renderPreflight(m);
}

Object.values(fields).forEach((el) => el.addEventListener("input", onEdit));

/* ============================================================
   6. EXPORT
   ============================================================ */

$("#btn-html").addEventListener("click", () => {
  const m = meta();
  if (!guard(m)) return;
  download(`${m.slug}.html`, buildPage(m));
  toast(`Saved ${m.slug}.html: drop it in /insights/`);
});

$("#btn-zip").addEventListener("click", async () => {
  const m = meta();
  if (!guard(m)) return;
  const { html, files } = await externalisePhotos(m);
  const zip = makeZip([
    { name: `${m.slug}.html`, data: new TextEncoder().encode(html) },
    ...files,
  ]);
  download(`${m.slug}.zip`, new Blob([zip], { type: "application/zip" }));
  toast(`Saved ${m.slug}.zip: ${files.length} photo file(s) inside`);
});

$("#btn-copy-html").addEventListener("click", () => {
  const m = meta();
  if (!guard(m)) return;
  copyText(buildPage(m), "Full page HTML copied");
});

$("#btn-entry").addEventListener("click", () => {
  const m = meta();
  const entry = indexEntry(m);
  $("#sheet-body").textContent = entry;
  $("#sheet-title").textContent = "Paste this at the top of the ARTICLES list in content.js";
  $("#sheet").showModal();
  $("#sheet-copy").onclick = () => copyText(entry, "Index entry copied");
});

$("#sheet-close").addEventListener("click", () => $("#sheet").close());

$("#btn-lock").addEventListener("click", () => {
  if (confirm("Lock the Studio? Your draft stays saved on this device.")) lock();
});

/** Empty the editor and forget what it was tied to. */
function blankEditor() {
  editor.replaceChildren();
  Object.values(fields).forEach((el) => {
    if (el.type === "date") el.value = new Date().toISOString().slice(0, 10);
    else if (el.tagName !== "SELECT") el.value = "";
  });
  current.slug = null;
  current.notionPageId = null;
  onEdit();
  refreshNow();
}

/* New keeps the draft you were on and starts another beside it;
   Clear throws the current one away. That distinction is the whole
   point of drafts having ids. */
$("#btn-new").addEventListener("click", () => {
  current.draftId = null;
  blankEditor();
  draftLine.textContent = "";
  toast("New article. The one you were on is under Open.");
});

$("#btn-clear").addEventListener("click", async () => {
  if (!confirm("Clear the editor and delete this draft? Anything already published stays published.")) return;
  await clearDraft();
  blankEditor();
  draftLine.textContent = "";
  toast("Cleared");
});

function guard(m) {
  if (!m.body.trim()) {
    toast("Paste the article text first.");
    editor.focus();
    return false;
  }
  if (!fields.title.value.trim()) {
    toast("Give it a headline first.");
    fields.title.focus();
    return false;
  }
  return true;
}

/* ============================================================
   6b. PRE-FLIGHT

   The things an editor checks before a piece goes out, checked
   every time instead of when someone remembers. An `error` stops
   the publish; a `warn` is worth knowing and never blocks — the
   author decides whether a photo needs alt text, not this file.
   ============================================================ */

const MAX_BODY_BYTES = 1_000_000;      // matches the server's limit
const DEK_LIMIT = 160;                 // what a search result shows

/** Slugs already taken in the database, so a collision is caught
    before the publish rather than by the 409 afterwards. */
let takenSlugs = new Map();

async function refreshSlugs() {
  if (!dynamic) return;
  const rows = (await api("articles?all=1"))?.articles ?? [];
  takenSlugs = new Map(rows.map((a) => [a.slug, a]));
}

function preflight(m) {
  const issues = [];
  const add = (level, text) => issues.push({ level, text });

  if (!m.title || m.title === "Untitled article") add("error", "It needs a headline.");
  if (!m.body.trim()) add("error", "There's no article in the editor yet.");

  const size = new Blob([m.body]).size;
  if (size > MAX_BODY_BYTES) {
    add("error", `The article is ${Math.round(size / 1024)} KB, over the ${Math.round(MAX_BODY_BYTES / 1024)} KB limit. `
      + "Publishing uploads photos to /media, which usually fixes this on its own.");
  }

  // A slug that belongs to something else is the one that used to
  // overwrite a live piece without asking.
  const clash = takenSlugs.get(m.slug);
  if (clash && clash.slug !== current.slug) {
    add("error", `The file name "${m.slug}" is already ${clash.status === "live" ? "live" : "a draft"} `
      + `as "${clash.title}". Change it, or open that piece and edit it instead.`);
  }

  if (!m.dek) add("warn", "No standfirst. It's what shows under the headline and in search results.");
  else if (m.dek.length > DEK_LIMIT) {
    add("warn", `The standfirst is ${m.dek.length} characters; search results cut off around ${DEK_LIMIT}.`);
  }
  if (!fields.tag.value.trim()) add("warn", "No label, so it'll publish as \"Note\".");

  const doc = new DOMParser().parseFromString(m.body, "text/html");

  const noAlt = [...doc.querySelectorAll("img")].filter((i) => !i.getAttribute("alt")?.trim());
  if (noAlt.length) {
    add("warn", `${noAlt.length} photo${noAlt.length === 1 ? " has" : "s have"} no alt text, `
      + "so a screen reader has nothing to say about them.");
  }

  // A piece that opens at h3 reads as a fragment to anything parsing
  // the outline, search engines included.
  const levels = [...doc.querySelectorAll("h2, h3")].map((h) => h.tagName);
  if (levels[0] === "H3") add("warn", "The first heading is a sub-heading. Start at H2.");

  const insecure = [...doc.querySelectorAll('a[href^="http://"]')];
  if (insecure.length) {
    add("warn", `${insecure.length} link${insecure.length === 1 ? "" : "s"} still point at http://, `
      + "which browsers flag.");
  }

  const unhosted = [...doc.querySelectorAll("img")]
    .filter((i) => !ALREADY_HOSTED.test(i.getAttribute("src") ?? "")).length;
  if (unhosted && dynamic) {
    add("info", `${unhosted} photo${unhosted === 1 ? "" : "s"} will be uploaded to /media on publish.`);
  }

  return issues;
}

const LEVEL_LABEL = { error: "Stops publishing", warn: "Worth a look", info: "For information" };

function renderPreflight(m) {
  const panel = $("#preflight");
  if (!panel) return [];

  const issues = preflight(m);
  const errors = issues.filter((i) => i.level === "error");

  // An empty editor isn't a problem worth shouting about yet.
  const started = m.body.trim() || fields.title.value.trim();
  panel.hidden = !started;

  $("#preflight-list").replaceChildren(...issues.map((issue) => {
    const li = document.createElement("li");
    li.dataset.level = issue.level;
    const label = document.createElement("span");
    label.className = "mono";
    label.textContent = LEVEL_LABEL[issue.level];
    const text = document.createElement("span");
    text.textContent = issue.text;
    li.append(label, text);
    return li;
  }));

  $("#preflight-summary").textContent = errors.length
    ? `${errors.length} to fix`
    : issues.length ? `${issues.length} note${issues.length === 1 ? "" : "s"}` : "All clear";
  panel.dataset.state = errors.length ? "blocked" : "clear";

  for (const id of ["#btn-publish", "#btn-save-draft"]) {
    const btn = $(id);
    if (btn) btn.disabled = errors.length > 0;
  }
  return issues;
}

/* ============================================================
   6c. OPEN — drafts on this device, articles in the database
   ============================================================ */

const openSheet = $("#open-sheet");

const rowButton = (label, onClick, className = "chip") => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
};

function sectionLabel(text) {
  const s = document.createElement("span");
  s.className = "mono section-label";
  s.textContent = text;
  return s;
}

async function showOpen() {
  const body = $("#open-body");
  body.replaceChildren(Object.assign(document.createElement("p"),
    { className: "muted mono", textContent: "Loading…" }));
  openSheet.showModal();

  const drafts = await listDrafts();
  const articles = dynamic ? ((await api("articles?all=1"))?.articles ?? []) : [];
  takenSlugs = new Map(articles.map((a) => [a.slug, a]));

  const nodes = [];

  nodes.push(sectionLabel("Drafts on this device"));
  if (!drafts.length) {
    nodes.push(Object.assign(document.createElement("p"),
      { className: "muted", textContent: "No drafts yet." }));
  }
  for (const draft of drafts) {
    const line = document.createElement("div");
    line.className = "admin-line";
    const title = draft.fields?.title?.trim() || "Untitled";
    line.append(
      Object.assign(document.createElement("span"), {
        textContent: title + (draft.id === current.draftId ? " (open)" : ""),
      }),
      Object.assign(document.createElement("span"), {
        className: "mono muted",
        textContent: draft.savedAt ? new Date(draft.savedAt).toLocaleString() : "",
      }),
      rowButton("Open", () => { loadDraft(draft); openSheet.close(); }),
      rowButton("Delete", async () => {
        if (!confirm(`Delete the draft "${title}"?`)) return;
        await idb("readwrite", (store) => store.delete(draft.id));
        if (draft.id === current.draftId) current.draftId = null;
        showOpen();
      })
    );
    nodes.push(line);
  }

  if (dynamic) {
    nodes.push(sectionLabel("Published through the Studio"));
    if (!articles.length) {
      nodes.push(Object.assign(document.createElement("p"),
        { className: "muted", textContent: "Nothing in the database yet." }));
    }
    for (const article of articles) {
      const line = document.createElement("div");
      line.className = "admin-line";
      line.append(
        Object.assign(document.createElement("span"), { textContent: article.title }),
        Object.assign(document.createElement("span"), {
          className: "mono", textContent: article.status,
        }),
        rowButton("Edit", () => openArticle(article.slug))
      );
      nodes.push(line);
    }
  }

  body.replaceChildren(...nodes);
}

/** Pull a published article back into the editor. Without this the
    Studio could only ever create: the way to change a published
    piece was to retype it and hope the slug matched. */
async function openArticle(slug) {
  const res = await api(`articles/${encodeURIComponent(slug)}`);
  const article = res?.article;
  if (!article) { toast("Couldn't load that one."); return; }

  current.draftId = newDraftId();
  current.slug = article.slug;
  current.notionPageId = article.notion_page_id ?? null;

  editor.innerHTML = article.body ?? "";
  fields.title.value = article.title ?? "";
  fields.dek.value = article.dek ?? "";
  fields.tag.value = article.tag ?? "";
  fields.slug.value = article.slug ?? "";
  fields.date.value = (article.published_at ?? "").slice(0, 10)
    || new Date().toISOString().slice(0, 10);
  fields.lang.value = article.lang === "bn" ? "bn" : "en";

  openSheet.close();
  onEdit();
  refreshNow();
  toast(`Editing "${article.title}". Publishing updates it in place.`);
}

$("#btn-open").addEventListener("click", showOpen);
$("#open-close").addEventListener("click", () => openSheet.close());

$("#btn-view").addEventListener("click", () => {
  if (current.slug) open(`/insights/${current.slug}.html`, "_blank", "noopener");
});

/* ============================================================
   6d. NOTION

   Write in Notion, pull the page in here, publish from here. The
   conversion happens server-side; what arrives is already the small
   set of tags the site styles, with its photos pointed at the
   same-origin proxy so they survive long enough to be re-hosted.
   ============================================================ */

const notionSheet = $("#notion-sheet");

/** The 32 hex characters on the end of any Notion URL. */
const notionIdFrom = (text) => {
  const match = String(text).match(/([0-9a-f]{32})|([0-9a-f-]{36})/i);
  return match ? match[0] : null;
};

async function showNotion() {
  notionSheet.showModal();
  $("#notion-q").focus();
  searchNotion("");
}

let notionTimer;
async function searchNotion(query) {
  const body = $("#notion-body");
  body.replaceChildren(Object.assign(document.createElement("p"),
    { className: "muted mono", textContent: "Asking Notion…" }));

  // A pasted URL is a page, not a search term.
  const pasted = notionIdFrom(query);
  if (pasted && query.includes("notion.")) { importNotion(pasted); return; }

  const res = await notion.pages(query);
  if (!res?.ok) {
    body.replaceChildren(Object.assign(document.createElement("p"), {
      className: "muted",
      textContent: res?.message
        || "Notion didn't answer. Check NOTION_TOKEN, and that the page is shared with the integration.",
    }));
    return;
  }

  const pages = res.pages ?? [];
  if (!pages.length) {
    body.replaceChildren(Object.assign(document.createElement("p"), {
      className: "muted",
      textContent: "Nothing found. Remember a page is invisible to the integration "
        + "until you add it under the page's Connections menu.",
    }));
    return;
  }

  body.replaceChildren(...pages.map((page) => {
    const line = document.createElement("div");
    line.className = "admin-line";
    line.append(
      Object.assign(document.createElement("span"), {
        textContent: `${page.icon ? page.icon + " " : ""}${page.title}`,
      }),
      Object.assign(document.createElement("span"), {
        className: "mono muted",
        textContent: page.edited ? new Date(page.edited).toLocaleDateString() : "",
      }),
      rowButton("Import", () => importNotion(page.id))
    );
    return line;
  }));
}

async function importNotion(pageId, { silent = false } = {}) {
  const body = $("#notion-body");
  if (body) {
    body.replaceChildren(Object.assign(document.createElement("p"),
      { className: "muted mono", textContent: "Converting the page…" }));
  }

  const res = await notion.page(pageId);
  if (!res?.ok) {
    const message = res?.message || "That page couldn't be imported.";
    if (body) {
      body.replaceChildren(Object.assign(document.createElement("p"),
        { className: "muted", textContent: message }));
    } else {
      toast(message);
    }
    return;
  }

  const page = res.page;
  // A re-sync replaces the body of the piece already open; a fresh
  // import starts its own draft so it can't land on top of one.
  if (!silent) current.draftId = newDraftId();
  current.notionPageId = page.id;

  editor.innerHTML = page.body || "";
  if (page.title) fields.title.value = page.title;
  if (page.dek) fields.dek.value = page.dek;
  if (page.tag) fields.tag.value = page.tag;
  if (page.date) fields.date.value = page.date;
  if (page.lang) fields.lang.value = page.lang;
  if (page.slug && !silent) fields.slug.value = page.slug;

  notionSheet.close();
  onEdit();
  refreshNow();

  if (res.truncated) {
    toast("Imported, but the page was long enough to hit the block limit. Check the end of it.");
  } else {
    toast(silent ? "Re-synced from Notion." : `Imported "${page.title}". Photos upload when you publish.`);
  }
}

$("#btn-notion").addEventListener("click", showNotion);
$("#notion-close").addEventListener("click", () => notionSheet.close());
$("#notion-q").addEventListener("input", (e) => {
  clearTimeout(notionTimer);
  const query = e.target.value.trim();
  notionTimer = setTimeout(() => searchNotion(query), 300);
});

$("#btn-resync").addEventListener("click", () => {
  if (!current.notionPageId) return;
  if (!confirm("Replace the article body with the current Notion page? Anything typed here is lost.")) return;
  importNotion(current.notionPageId, { silent: true });
});

/** Pull data-URL photos out into real files for the zip export. */
async function externalisePhotos(m) {
  const doc = new DOMParser().parseFromString(buildPage(m), "text/html");
  const files = [];
  let n = 0;

  for (const img of doc.querySelectorAll('img[src^="data:"]')) {
    const src = img.getAttribute("src");
    const blob = await (await fetch(src)).blob();
    const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
    const name = `photos/${m.slug}-${++n}.${ext}`;
    files.push({ name, data: new Uint8Array(await blob.arrayBuffer()) });
    img.setAttribute("src", `/insights/${name}`);
  }
  return { html: `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`, files };
}

/* ============================================================
   7. A MINIMAL ZIP WRITER  (stored, no compression)
   WebP and JPEG are already compressed, so deflate would buy
   almost nothing and cost a dependency.
   ============================================================ */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makeZip(entries) {
  const enc = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;

  // DOS timestamp for "now"
  const now = new Date();
  const time = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const date = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

  for (const entry of entries) {
    const name = enc.encode(entry.name);
    const data = entry.data;
    const crc = crc32(data);

    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);   // local file header
    lv.setUint16(4, 20, true);           // version needed
    lv.setUint16(6, 0x0800, true);       // UTF-8 names
    lv.setUint16(8, 0, true);            // method: stored
    lv.setUint16(10, time, true);
    lv.setUint16(12, date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, name.length, true);
    local.set(name, 30);

    parts.push(local, data);

    const cd = new Uint8Array(46 + name.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0, 0x02014b50, true);   // central directory header
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, time, true);
    cv.setUint16(14, date, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, name.length, true);
    cv.setUint32(42, offset, true);
    cd.set(name, 46);
    central.push(cd);

    offset += local.length + data.length;
  }

  const cdSize = central.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);     // end of central directory
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);

  const total = offset + cdSize + 22;
  const out = new Uint8Array(total);
  let p = 0;
  for (const part of [...parts, ...central, end]) { out.set(part, p); p += part.length; }
  return out;
}

/* ============================================================
   8. DRAFTS — IndexedDB (photos blow past localStorage's 5 MB)
   ============================================================ */

const DB_NAME = "reiad-studio";
const STORE = "drafts";

function db() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idb(mode, fn) {
  try {
    const conn = await db();
    return await new Promise((resolve, reject) => {
      const tx = conn.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(req?.result);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return undefined;   // private mode, quota, disabled storage — never fatal
  }
}

/* Drafts used to share one record under the literal key "current",
   which meant exactly one piece could be in progress at a time and
   starting a second silently destroyed the first. They are keyed by
   id now, and the id travels in `current.draftId`. */

const newDraftId = () =>
  `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

let saveTimer;
function saveDraft() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    current.draftId ??= newDraftId();
    const draft = {
      id: current.draftId,
      savedAt: Date.now(),
      slug: current.slug,
      notionPageId: current.notionPageId,
      html: editor.innerHTML,
      fields: Object.fromEntries(
        Object.entries(fields).map(([k, el]) => [k, el.value])
      ),
    };
    await idb("readwrite", (store) => store.put(draft, draft.id));
    draftLine.textContent = `Draft saved ${new Date().toLocaleTimeString()}`;
  }, 700);
}

/** Drop the draft the editor is holding. The article it may have
    been published from is untouched — this is local only. */
async function clearDraft() {
  clearTimeout(saveTimer);
  if (current.draftId) {
    await idb("readwrite", (store) => store.delete(current.draftId));
  }
  current.draftId = null;
}

async function listDrafts() {
  const rows = await idb("readonly", (store) => store.getAll());
  return (rows ?? [])
    .filter((d) => d?.id)
    .sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
}

function loadDraft(draft) {
  current.draftId = draft.id ?? newDraftId();
  current.slug = draft.slug ?? null;
  current.notionPageId = draft.notionPageId ?? null;

  editor.innerHTML = draft.html ?? "";
  Object.entries(draft.fields ?? {}).forEach(([k, v]) => {
    if (fields[k]) fields[k].value = v ?? "";
  });
  draftLine.textContent = draft.savedAt
    ? `Draft from ${new Date(draft.savedAt).toLocaleString()}`
    : "";
  onEdit();
  refreshNow();
}

/** The most recent draft, and a one-time move of the old single
    "current" record into the new keyed shape. */
async function restoreDraft() {
  const legacy = await idb("readonly", (store) => store.get("current"));
  if (legacy && !legacy.id) {
    legacy.id = newDraftId();
    await idb("readwrite", (store) => store.put(legacy, legacy.id));
    await idb("readwrite", (store) => store.delete("current"));
  }

  const [latest] = await listDrafts();
  if (!latest) return false;
  loadDraft(latest);
  return true;
}

/* ---------- what the editor is holding, said out loud ---------- */

function refreshNow() {
  if (!nowLine) return;
  const bits = [];
  if (current.slug) bits.push(`editing /insights/${current.slug}.html`);
  else bits.push("new article");
  if (current.notionPageId) bits.push("linked to Notion");
  nowLine.textContent = bits.join(" · ");

  const resync = $("#btn-resync");
  if (resync) resync.hidden = !(dynamic && current.notionPageId);
  const view = $("#btn-view");
  if (view) view.hidden = !(dynamic && current.slug);
}

/* ============================================================
   Boot
   ============================================================ */
(async () => {
  fields.date.value = new Date().toISOString().slice(0, 10);
  await restoreDraft();
  renderPreview();
  refreshNow();
})();



/* ============================================================
   9. THE DYNAMIC LAYER
   Switched on only when the gate reports a real server session,
   so a static deployment behaves exactly as it always has.
   ============================================================ */

export function enableDynamic() {
  dynamic = true;
  document.getElementById("steps-static").hidden = true;
  document.getElementById("steps-dynamic").hidden = false;

  const publish = $("#btn-publish");
  const saveDraftToSite = $("#btn-save-draft");
  publish.hidden = false;
  saveDraftToSite.hidden = false;

  publish.addEventListener("click", () => send("live", publish, "Publish to the site"));
  saveDraftToSite.addEventListener("click", () => send("draft", saveDraftToSite, "Save draft to the site"));

  // The Notion button only appears if the token is actually set, so
  // it never offers something that answers "not configured".
  notion.status().then((res) => {
    if (res?.configured) $("#btn-notion").hidden = false;
  });

  refreshSlugs();
  refreshNow();

  const section = document.getElementById("dashboard-section");
  section.hidden = false;
  mountDashboard(document.getElementById("dashboard"));
}

/**
 * Publish, or save as a server-side draft.
 *
 * Two things happen before the request that didn't used to. Photos
 * are uploaded to /media and the body is rewritten to point at them,
 * which is what keeps a piece under the size limit. And a slug that
 * already belongs to something else is refused by the server rather
 * than silently overwriting it, so the 409 is turned into a question
 * instead of being reported as a failure.
 */
async function send(status, button, label) {
  const first = meta();
  if (!guard(first)) return;

  const issues = renderPreflight(first);
  if (issues.some((i) => i.level === "error")) {
    toast("Fix the items marked \"stops publishing\" first.");
    $("#preflight").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  button.disabled = true;
  const slug = first.slug;

  try {
    /* ---- photos first ---- */
    button.textContent = "Uploading photos…";
    const hosted = await hostPhotos(first.body, slug, (done, total) => {
      button.textContent = `Uploading photo ${done} of ${total}…`;
    });

    if (hosted.uploaded) {
      // Write the rewritten body back so the next save doesn't
      // re-upload the same photos, and the draft stops carrying
      // megabytes of base64 around with it.
      editor.innerHTML = hosted.html;
      onEdit();
    }
    if (hosted.failed) {
      toast(`${hosted.failed} photo${hosted.failed === 1 ? "" : "s"} wouldn't upload. `
        + "They're still in the article, but embedded.");
    }

    /* ---- then the article ---- */
    button.textContent = status === "live" ? "Publishing…" : "Saving…";
    const m = meta();

    const payload = {
      slug, title: m.title, dek: m.dek, tag: m.tag,
      topics: m.tag.split("·").map((t) => t.trim()).filter(Boolean),
      lang: m.lang, body: m.body, status, published_at: m.date,
      notion_page_id: current.notionPageId ?? undefined,
      // Editing something already opened from the database is the
      // one case where replacing it is exactly the intent.
      overwrite: current.slug === slug,
    };

    let result = await api("articles", { method: "POST", timeout: 60000, body: payload });

    if (result?.reason === "slug-exists") {
      const existing = result.existing ?? {};
      const yes = confirm(
        `"${existing.title}" already uses the file name ${slug}, and it is `
        + `${existing.status === "live" ? "live" : "a draft"}.\n\n`
        + "Replace it with what's in the editor? There's no undo."
      );
      if (!yes) { toast("Left it alone. Change the file name to publish this separately."); return; }
      result = await api("articles", {
        method: "POST", timeout: 60000, body: { ...payload, overwrite: true },
      });
    }

    if (result?.ok) {
      current.slug = slug;
      await refreshSlugs();
      refreshNow();
      toast(status === "live"
        ? `Published: /insights/${slug}.html`
        : `Saved as a draft. It isn't public until you publish it.`);
      document.getElementById("dashboard-section").hidden = false;
      mountDashboard(document.getElementById("dashboard"));
    } else if (result?.reason === "body-too-large") {
      toast(`Still too big at ${Math.round((result.size ?? 0) / 1024)} KB. `
        + "Some photos didn't upload, so they're inflating the article.");
    } else if (result?.reason === "unauthorised") {
      toast("Session expired: reload and sign in again.");
    } else {
      toast(result?.message || "Couldn't save. Download the file as a fallback.");
    }
  } finally {
    button.disabled = false;
    button.textContent = label;
    renderPreflight(meta());
  }
}
