/* ============================================================
   studio.js: the Article Studio.

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

import { toast } from "/app.js";
import { lock } from "/auth.js";
import { api, uploadMedia, notion } from "/api.js";
import {
  liveArticles, SECTIONS, findSection, pieceUrl, livePieces,
} from "/content.js";
import {
  SHARE_W, SHARE_H, shareCardBlob, coverFromDocument, cardSlug, cardShape,
} from "/share-card.js";
/* Photo handling is shared with the desk, which repairs pieces
   published while the data: URL read-back was blocked. The long
   note at the top of photo.js is worth reading before touching
   any of it. */
import { encodeImage, hostPhotosIn, isHosted, isOffSite } from "/photo.js";

/* ============================================================
   Elements
   ============================================================ */
const $ = (sel) => document.querySelector(sel);

const editor = $("#editor");
const preview = $("#preview");
const fields = {
  title: $("#f-title"),
  dek: $("#f-dek"),
  slug: $("#f-slug"),
  date: $("#f-date"),
  lang: $("#f-lang"),
  /* Where the piece is going. Everything downstream reads it:
     the URL it is published at, the hub it appears on, the toast
     that names it, and the row the desk shows it in. Adding a
     section is an entry in SECTIONS, not an edit here. */
  section: $("#f-section"),
};
const meterBar = $("#meter-bar");
const meterText = $("#meter-text");
const statLine = $("#stat-line");
const draftLine = $("#draft-line");
const nowLine = $("#now-line");

/* What the editor currently holds. `slug` is set once a piece has
   been saved to the database, and is what tells a republish from a
   first publish, without it, editing a live article and pressing
   publish would look exactly like a slug collision. */
const current = {
  draftId: null,
  slug: null,
  /* The section the piece is published in, which is not always the
     one the picker is showing: changing the picker on an open piece
     is a request to move it, and until it is saved the live URL is
     still the old one. "View" and the line under the toolbar have to
     say where it actually is. */
  section: null,
  notionPageId: null,
};

/* Set by enableDynamic(); everything server-shaped checks it first
   so the Studio still runs as a pure export tool without a backend. */
let dynamic = false;

/* ============================================================
   0. WHERE IT IS GOING, AND WHAT IT IS ABOUT

   Two small pieces of state that used not to exist. The Studio
   was written when there was one place to publish to and one
   label per piece; there are now three sections and pieces that
   are honestly about several things at once.
   ============================================================ */

/** Where a piece is going, as a segmented control over a hidden
    <select>. Both are filled from SECTIONS, so the list of places to
    publish to lives in exactly one file.

    The select is the real field: drafts, meta() and the page builder
    all read fields.section.value and none of them has to know that a
    row of buttons is driving it. The buttons exist because choosing
    between three places is a decision you make constantly, and a
    dropdown makes you click twice to see what the options even are. */
function buildSectionPicker() {
  const select = fields.section;
  const seg = $("#f-section-seg");
  if (!select) return;

  select.replaceChildren(...SECTIONS.map((sec) =>
    Object.assign(document.createElement("option"), {
      value: sec.id,
      textContent: sec.id === "insights" ? sec.en : `${sec.bn} · ${sec.en}`,
    })));

  if (!seg) return;
  seg.replaceChildren(...SECTIONS.map((sec) => {
    const b = Object.assign(document.createElement("button"), {
      type: "button",
      className: "chip",
      textContent: sec.id === "insights" ? sec.en : sec.bn,
      title: `${sec.en}: ${sec.mount}`,
    });
    b.dataset.section = sec.id;
    b.setAttribute("role", "radio");
    b.addEventListener("click", () => {
      select.value = sec.id;
      paintSectionPicker();
      onEdit();
      refreshNow();
    });
    return b;
  }));
  paintSectionPicker();
}

/** Keep the buttons and the hint agreeing with the select, wherever
    the change came from: a click, a restored draft, or an article
    opened out of the database. */
function paintSectionPicker() {
  const sec = currentSection();
  $("#f-section-seg")?.querySelectorAll("[data-section]").forEach((b) => {
    const on = b.dataset.section === sec.id;
    b.setAttribute("aria-checked", String(on));
    b.toggleAttribute("data-on", on);
  });
  const hint = $("#section-hint");
  if (hint) hint.textContent = `${sec.mount}<file>.html · ${sec.blurb}`;
}

/** The section currently chosen, as the whole object. */
const currentSection = () => findSection(fields.section?.value);

/* ---------- topics ----------

   A piece can be about more than one thing, and until now it could
   not say so: the publish path split the single label on its middle
   dot and called the halves topics, which meant "Explainer ·
   Equities" quietly became the topics "Explainer" and "Equities",
   one of which is not a topic at all.

   Topics are their own field now: chips you add with Enter or a
   comma and remove with Backspace or a click. They are stored as an
   array and sent as an array. */
let topics = [];

const topicChips = () => $("#topic-chips");
const topicInput = () => $("#f-topics");

/** The topics inside a label. The older pieces carry their label as
    one string with middle dots in it, which is exactly the list this
    field holds, written the old way. */
const topicsFromTag = (tag) =>
  String(tag ?? "").split(/[·•|,]/).map((t) => t.trim()).filter(Boolean);

/** Every topic already in use anywhere on the site, so the field
    suggests the vocabulary that exists rather than inviting a
    fourth spelling of the same word.

    Both sources count: the pieces in content.js and whatever is in
    the database, and in both cases the label counts as topics,
    because that is what a label has always been here. */
function knownTopics() {
  const seen = new Map();      // lower case → the spelling to offer
  const add = (t) => {
    const key = String(t).trim().toLowerCase();
    if (key && !seen.has(key)) seen.set(key, String(t).trim());
  };
  SECTIONS.forEach((sec) => sec.pieces().forEach((p) => {
    (p.topics ?? []).forEach(add);
    if (!p.topics?.length) topicsFromTag(p.tag).forEach(add);
  }));
  takenSlugs.forEach((a) => {
    (a.topics ?? []).forEach(add);
    if (!a.topics?.length) topicsFromTag(a.tag).forEach(add);
  });
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

/** The ones worth showing as buttons: what this piece has not got
    already, most useful first, and few enough to read at a glance. */
function renderTopicSuggestions() {
  const host = $("#topic-known");
  const box = $("#topic-suggest");
  if (!host || !box) return;

  const have = new Set(topics.map((t) => t.toLowerCase()));
  const offer = knownTopics().filter((t) => !have.has(t.toLowerCase())).slice(0, 10);
  box.hidden = !offer.length || topics.length >= 6;

  host.replaceChildren(...offer.map((t) =>
    Object.assign(document.createElement("button"), {
      type: "button",
      className: "chip",
      textContent: t,
      onclick: () => { addTopics(t); topicInput()?.focus(); },
    })));
}

function renderTopics() {
  const host = topicChips();
  if (!host) return;
  host.replaceChildren(...topics.map((t, i) => {
    const chip = Object.assign(document.createElement("span"), {
      className: "topic-chip",
    });
    chip.append(
      Object.assign(document.createElement("span"), { textContent: t }),
      /* ariaLabel, not "aria-label": Object.assign sets properties,
         and a property by that name is just a property. The chip
         read as "✕" to a screen reader for as long as it existed. */
      Object.assign(document.createElement("button"), {
        type: "button",
        className: "topic-x",
        title: `Remove ${t}`,
        ariaLabel: `Remove the topic ${t}`,
        textContent: "✕",
        onclick: () => { topics.splice(i, 1); renderTopics(); onEdit(); },
      })
    );
    return chip;
  }));
  const field = $("#topic-field");
  if (field) field.dataset.count = String(topics.length);
  renderTopicSuggestions();
}

/** Add whatever is typed, split on commas so a paste of
    "Visas, Paperwork" becomes two chips rather than one long one. */
function addTopics(text) {
  const wanted = String(text).split(/[,،|]/).map((t) => t.trim()).filter(Boolean);
  let added = false;
  wanted.forEach((t) => {
    // Case-insensitive, because "Visas" and "visas" are one topic
    // and two chips is how a filter list ends up with both.
    if (topics.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    if (topics.length >= 6) return;
    topics.push(t);
    added = true;
  });
  if (added) { renderTopics(); onEdit(); }
  return added;
}

function setTopics(list) {
  topics = [...new Set((list ?? []).map((t) => String(t).trim()).filter(Boolean))].slice(0, 6);
  renderTopics();
}

/** The datalist behind the box. Redrawn whenever the vocabulary
    grows, which is after the database has answered as well as at
    boot: at boot it only knows what content.js holds. */
function paintTopicOptions() {
  const suggestions = $("#topic-options");
  if (!suggestions) return;
  suggestions.replaceChildren(...knownTopics().map((t) =>
    Object.assign(document.createElement("option"), { value: t })));
  renderTopicSuggestions();
}

function wireTopics() {
  const input = topicInput();
  if (!input) return;

  paintTopicOptions();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      if (!input.value.trim()) return;          // Tab still tabs when empty
      e.preventDefault();
      if (addTopics(input.value)) input.value = "";
      else toast(topics.length >= 6 ? "Six topics is plenty." : "Already there.");
      return;
    }
    /* Backspace on an empty box takes the last chip, the way every
       tag field a writer has ever used behaves. */
    if (e.key === "Backspace" && !input.value && topics.length) {
      topics.pop();
      renderTopics();
      onEdit();
    }
  });

  // Losing focus commits what is typed: nobody expects a half-typed
  // topic to vanish because they clicked the preview.
  input.addEventListener("blur", () => {
    if (input.value.trim() && addTopics(input.value)) input.value = "";
  });

  /* Picking from the datalist fires input, not keydown, and the
     browser says so: a click on a suggestion is an
     insertReplacementText, ordinary typing is an insertText. Without
     that test the field committed a chip the moment what was typed
     happened to match an existing topic, so typing "Visas" turned
     into a chip at "Visa" and left the writer holding an "s". */
  input.addEventListener("input", (e) => {
    const picked = !e.inputType || e.inputType === "insertReplacementText";
    if (picked && input.value.trim() && addTopics(input.value)) input.value = "";
  });

  $("#topic-field")?.addEventListener("click", (e) => {
    if (e.target.closest(".topic-x")) return;
    input.focus();
  });
}

/* ============================================================
   1. SANITISER: the pasted-HTML gauntlet
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

/* The class names the stylesheet actually knows about: the same list
   _lib/sanitise.js enforces server-side.

   Without this the two sanitisers disagreed, and the browser's was
   the stricter one: a <div class="note"> became a plain paragraph and
   figure.wide lost its class on the way out of the editor. Which
   meant the server's support for these was unreachable from the one
   tool that writes to it, and every callout imported from Notion
   arrived flattened. */
const KEEP_CLASSES = new Set([
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
const CLASS_CARRIERS = new Set(["DIV", "P", "UL", "OL", "FIGURE", "A"]);

const keptClasses = (node) =>
  CLASS_CARRIERS.has(node.tagName)
    ? [...(node.classList ?? [])].filter((c) => KEEP_CLASSES.has(c))
    : [];

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


/** File/Blob → a downscaled WebP blob, stripped of EXIF.
    The single place that decides what a photo on this site weighs:
    both the editor and the /media uploader come through here. */
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

   The site's article vocabulary is small and specific, a note box,
   a worked example, a wide figure, a table that scrolls on a phone,
   and until now the only way to get one was to write the HTML by
   hand and paste it in. These put the whole set a slash away, and
   the markdown rules cover the shapes people type out of habit.
   ============================================================ */

/** The top-level block the caret is in.

    An empty editor has no blocks at all, the first characters typed
    land in a bare text node parented to the editor itself, so that
    case returns the editor. Without it the markdown rules did nothing
    until the article already had a paragraph in it, which is to say
    they did nothing on the first line of every new piece. */
function blockOf(node) {
  let el = node?.nodeType === Node.TEXT_NODE ? node.parentNode : node;
  if (el === editor) return editor;
  while (el && el !== editor && el.parentNode !== editor) el = el.parentNode;
  return el && el !== editor ? el : null;
}

/** Put the caret after the top-level block it is sitting in.

    A block is a thing beside other things, never a thing inside
    one. Without this, inserting a checklist while the caret was in
    the first line of a numbered list nested one list inside the
    other, and the browser threw the class away merging them: the
    block simply did not appear. It also means that asking for a
    note halfway through a paragraph puts the note after the
    paragraph rather than splitting it in two. */
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
function outerBlock(node) {
  let el = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  let found = null;
  while (el && el !== editor) {
    if (el.matches?.(BLOCK_SEL)) found = el;
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
function insertBlockHtml(html) {
  editor.focus();
  const fragment = document.createRange().createContextualFragment(html);
  const added = [...fragment.children];
  const sel = getSelection();
  const here = sel?.rangeCount ? outerBlock(sel.getRangeAt(0).startContainer) : null;

  if (!here) {
    editor.append(fragment);
  } else if (here.tagName === "P" && !here.textContent.trim()) {
    // An empty paragraph is where the caret waits, not content.
    here.replaceWith(fragment);
  } else {
    here.after(fragment);
  }

  /* Somewhere to carry on typing, once, rather than a blank line
     per block for as long as you keep adding them. */
  const tail = added[added.length - 1];
  const next = tail?.nextElementSibling;
  if (tail && !(next?.tagName === "P" && !next.textContent.trim())) {
    tail.after(Object.assign(document.createElement("p"), { innerHTML: "<br>" }));
  }

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
  + "</tbody></table></div>";

/* The labels inside a block are written in the language the piece
   is in, because they are copy, not chrome: a Bangla piece with an
   English "At a glance" over its Bangla facts is a piece with an
   English word in it. Every one of them is selected on insert, so
   the first thing you type replaces it. */
const WORDS = {
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

/** The words for the language the piece is being written in. */
const words = () => WORDS[fields.lang?.value === "bn" ? "bn" : "en"];

/* The blocks a long read is made of, as one list.
   `label` is what the slash menu and the toolbar show, `hint` is
   the line under it, and `html` is what lands at the caret with
   `data-fill` marking where the writing starts.

   These exist because the travel piece needed all five and none of
   them could be made from inside the Studio: they were typed as raw
   HTML into the file by hand, which is exactly the thing this tool
   is for not doing. */
const BLOCKS = [
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
  { label: "Photo", hint: "Resized and re-encoded", run: () => $("#photo-input").click() },
];

/** Every block can be run the same way, whether it brought a
    function or a piece of markup. */
const runBlock = (block) => (block.run ? block.run() : insertBlockHtml(block.html()));

/** The toolbar's block buttons name a block by its class; this is
    how markup in studio.html and the list above stay one list. */
const blockByKey = (key) => BLOCKS.find((b) => b.key === key);

/* ---------- markdown, for the shapes people type anyway ---------- */

const INPUT_RULES = [
  { re: /^#{1,2}$/, run: () => exec("formatBlock", "h2") },
  { re: /^#{3,6}$/, run: () => exec("formatBlock", "h3") },
  { re: /^[-*+]$/, run: () => exec("insertUnorderedList") },
  { re: /^1[.)]$/, run: () => exec("insertOrderedList") },
  { re: /^>$/, run: () => exec("formatBlock", "blockquote") },
  { re: /^---$/, run: () => insertBlockHtml("<hr>") },
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
     editor has none: it silently does nothing, which is why "##"
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

/* The toolbar's Blocks row. Same list as the slash menu, for the
   writer who would rather see the options than remember them. */
document.querySelectorAll("[data-block]").forEach((btn) => {
  const block = blockByKey(btn.dataset.block);
  if (!block) return;
  btn.title = `${block.label}: ${block.hint}`;
  btn.addEventListener("click", () => { editor.focus(); runBlock(block); });
});

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
  runBlock(item);
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

/* The three decisions a photo needs, as three sets of classes.
   Each set is exclusive: picking one clears the others, so a
   figure can never be both square and 16:9 and the markup never
   accumulates the history of what you tried. */
const FIG_SIZES = [
  ["", "Normal", "As wide as the text"],
  ["wide", "Wide", "Wider than the text"],
  ["full", "Full", "Edge to edge"],
];
const FIG_FRAMES = [
  ["", "As shot", "Whatever shape it came in"],
  ["frame-wide", "16:9", "Cropped wide"],
  ["frame-square", "Square", "Cropped square"],
  ["frame-tall", "4:5", "Cropped tall"],
];
const FIG_FOCUS = [
  ["", "Centre", "Keep the middle"],
  ["focus-top", "Top", "Keep the top"],
  ["focus-bottom", "Bottom", "Keep the bottom"],
];

/** Set one class out of a set, or none of them. */
function setFromSet(figure, set, wanted) {
  set.forEach(([cls]) => { if (cls) figure.classList.remove(cls); });
  if (wanted) figure.classList.add(wanted);
}

const chosenFrom = (figure, set) =>
  set.find(([cls]) => cls && figure.classList.contains(cls))?.[0] ?? "";

function showFigBar(img) {
  activeFigure = img;
  const figure = img.closest("figure");

  const chip = (label, pressed, onClick, title) => {
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
  const group = (name, set) => {
    if (!figure) return null;
    const chosen = chosenFrom(figure, set);
    const row = document.createElement("span");
    row.className = "fig-group";
    row.append(
      Object.assign(document.createElement("span"), { className: "mono", textContent: name }),
      ...set.map(([cls, label, hint]) =>
        chip(label, cls === chosen, () => {
          setFromSet(figure, set, cls);
          onEdit();
          showFigBar(img);
        }, hint))
    );
    return row;
  };

  const lead = !!figure?.classList.contains("lead-photo");

  figBar.replaceChildren(
    group("Size", FIG_SIZES),
    group("Shape", FIG_FRAMES),
    /* Which part to keep. It only does anything once the photo is
       being cropped, either by a frame here or by the 1200x630
       share card, so it says so rather than sitting there inert. */
    group("Keep", FIG_FOCUS),
    chip(img.getAttribute("alt")?.trim() ? "Alt ✓" : "Alt", null, () => {
      const alt = prompt("Describe the photo for a screen reader:", img.getAttribute("alt") ?? "");
      if (alt !== null) { img.setAttribute("alt", alt.trim()); onEdit(); showFigBar(img); }
    }, "What a screen reader says instead of showing it"),
    figure ? chip(lead ? "Lead ✓" : "Lead", lead, () => {
      /* One lead photo per piece: it is the one the share card is
         made from, and two of them is a question with no answer. */
      if (!lead) {
        editor.querySelectorAll("figure.lead-photo")
          .forEach((f) => f.classList.remove("lead-photo"));
      }
      figure.classList.toggle("lead-photo", !lead);
      onEdit();
      showFigBar(img);
    }, "Use this one for the social share card") : null,
    chip("Remove", null, () => {
      if (!confirm("Remove this photo?")) return;
      (figure ?? img).remove();
      hideFigBar();
      onEdit();
    })
  );

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
    if (publish && !publish.hidden && !publish.disabled) publish.click();
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
    /* The line above the headline, made of the topics rather than
       typed a second time. Three is what fits on a card. */
    tag: topics.slice(0, 3).join(" · ") || (lang === "bn" ? "লেখা" : "Note"),
    // Slugified even when typed by hand. It used to be taken raw, so
    // "German Alphabets" stayed "German Alphabets" here and in the
    // index-entry block, while the server quietly stored
    // "germanalphabets"– two different answers to what the URL is,
    // and the one that got pasted into content.js was the broken one.
    slug: slugify(fields.slug.value.trim() || title),
    date: fields.date.value || new Date().toISOString().slice(0, 10),
    lang,
    section: currentSection().id,
    topics: [...topics],
    body,
    ...stats,
  };
}

/* What changes about the finished page when it is going somewhere
   other than Insights. The three sections share a shell and differ
   in five small ways, so they are described once here rather than
   with a conditional at each of the five places.

   `note` is the line at the foot of a piece. Insights carries a
   financial disclaimer because it is about money; a piece about
   onions carrying one would be comic, and a piece about visas needs
   a different disclaimer entirely, not the same one. */
const PAGE_STYLE = {
  insights: {
    bodyClass: "",
    og: "/og/insights.png",
    back: { url: "/insights.html", kicker: "All insights", label: "Back to the index →" },
    side: { url: "/learn/index.html", kicker: "শেখার লাইব্রেরি", label: "Learn hub: বাংলায় →" },
    note: "This piece is general education, not investment advice. Rules, rates and "
      + "fees change, confirm the current details with the relevant institution "
      + "before acting on anything here.",
    footer: "Everything on this site is general education, not investment advice. "
      + "Do your own research before putting money anywhere.",
  },
  cooking: {
    bodyClass: "cooking read",
    og: "/og/cooking.png",
    back: { url: "/cooking/index.html", kicker: "রান্নাঘর", label: "সব লেখা এক জায়গায় →" },
    side: { url: "/skills/index.html", kicker: "দক্ষতা", label: "আর কী কী শেখানো হয় →" },
    note: "রান্নাঘরের লেখাগুলো রেসিপি নয়, বোঝার জন্য। নিজের রান্নাঘর, নিজের চুলা আর নিজের "
      + "স্বাদ অনুযায়ী মাপ আর সময় একটু এদিক-ওদিক হবেই।",
    footer: "রান্নাঘরের লেখাগুলো বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া।",
  },
  travel: {
    bodyClass: "travel read",
    og: "/og/travel.png",
    back: { url: "/travel/index.html", kicker: "ভ্রমণ", label: "সব লেখা এক জায়গায় →" },
    side: { url: "/skills/index.html", kicker: "দক্ষতা", label: "আর কী কী শেখানো হয় →" },
    note: "এই লেখাটা সাধারণ তথ্য, আইনি পরামর্শ নয়। ভিসার নিয়ম আর ফি বদলায়, তাই আবেদনের "
      + "আগে অফিসিয়াল গাইডেন্স একবার দেখে নিন।",
    footer: "ভ্রমণের লেখাগুলো বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া।",
  },
};

const styleFor = (m) => PAGE_STYLE[m.section] ?? PAGE_STYLE.insights;

/** The public URL a piece will have, in whichever section. */
const urlFor = (m) => pieceUrl(findSection(m.section), m.slug);

const FONTS =
  "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@400;500&family=Noto+Serif+Bengali:wght@500;600&display=swap";

/** The finished, standalone page: same chrome as every other page. */
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

/* ---------- what the preview is showing ----------

   An article is not the only thing a reader meets. Most of them meet
   the card on the Insights page, or the box that appears when someone
   pastes the link into WhatsApp, and both of those decide whether
   the article gets opened at all. Neither was visible from here. */

const view = { mode: "article", width: "full", theme: "auto" };

const dateLabelFor = (m) =>
  new Intl.DateTimeFormat(m.lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${m.date}T00:00:00Z`));

/** The image a social card would use, and which part of it to
    keep: the lead photo if one is marked, otherwise the first
    photo, otherwise the section's default card. Data URLs are fine
    here: this is a preview, and the same picture becomes a /media
    path on publish. */
function coverFor(m) {
  const doc = new DOMParser().parseFromString(m.body, "text/html");
  return withDefault(coverFromDocument(doc), m);
}

/** A piece with no picture of its own falls back to the card its
    section has. Which section that is is a Studio question, which
    is why share-card.js does not answer it. */
const withDefault = (pick, m) => (pick.own
  ? pick
  : { ...pick, src: styleFor(m ?? { section: "insights" }).og, focus: "centre" });

/** A social crawler must fetch an ordinary public URL. The Studio can
    display a data URL while the writer is editing, but it cannot put
    one in og:image: social platforms ignore it and show the fallback.
    By the time a piece is published, hostPhotosIn() has rewritten
    every photo to /media/, which is safe on an absolute public URL.

    /insights/photos/ used to be allowed here too, because the ZIP
    export wrote photos to that path. That export is gone with the
    rest of the file-publishing route (TRANSITION.md, Stage 4), and
    so is the path: nothing serves it, so allowing it here could only
    ever produce an og:image pointing at a 404. */
function socialCoverURL(pick, m) {
  const src = typeof pick === "string" ? pick : pick?.src;
  return /^\/media\/[A-Za-z0-9._/-]+$/.test(src ?? "")
    ? `https://reiad.co.uk${src}`
    : `https://reiad.co.uk${styleFor(m ?? { section: "insights" }).og}`;
}

/** Only a path this site serves can be stored as the cover; a data
    URL is still waiting to be uploaded, and the default is not worth
    recording. Mirrors safeCover() on the server. */
const storableCover = (src) => (/^\/media\//.test(src) ? src : "");

const ARTICLE_VIEW = (m) => `
    <article class="article">
      <span class="eyebrow mono">${escapeHtml(m.tag)}</span>
      <h1>${escapeHtml(m.title)}</h1>
      ${m.dek ? `<p class="lede">${escapeHtml(m.dek)}</p>` : ""}
      <p class="byline mono"><span>Rony Reiad</span><span class="dot"></span>
        <time>${dateLabelFor(m)}</time><span class="dot"></span><span>${m.minutes} min read</span></p>
      ${m.body || '<p class="muted"><em>Your article will appear here as you paste it.</em></p>'}
    </article>`;

/* The same markup app.js builds for /insights.html, so what shows
   here is the card, not an impression of one. */
const CARD_VIEW = (m) => {
  const sec = findSection(m.section);
  return `
    <div class="preview-frame">
      <span class="mono preview-caption">How it looks on ${escapeHtml(sec.id === "insights"
        ? "the Insights page and the home page" : `${sec.bn}, at ${sec.hub}`)}</span>
      <div class="cards">
        <div class="cell sample-card">
          <span class="tag mono">${escapeHtml(m.tag)}</span>
          <h3>${escapeHtml(m.title)}</h3>
          <p>${escapeHtml(m.dek) || "<em>No standfirst yet, so the card has nothing under the headline.</em>"}</p>
          ${m.topics.length ? `<span class="topic-tags">${m.topics
            .map((t) => `<span class="topic-tag mono">${escapeHtml(t)}</span>`).join("")}</span>` : ""}
          <span class="more">${dateLabelFor(m)} · ${m.minutes} min read  →</span>
        </div>
      </div>
    </div>`;
};

/* WhatsApp, LinkedIn, X and Slack all draw roughly this: the image,
   the domain, the title, the description. The truncation lengths are
   the conservative end of what they show. */
const FOCUS_POSITION = { top: "50% 0", bottom: "50% 100%", centre: "50% 50%" };

const SHARE_VIEW = (m) => {
  const cover = coverFor(m);
  const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
  return `
    <div class="preview-frame">
      <span class="mono preview-caption">What a pasted link looks like</span>
      <div class="share-card">
        <div class="share-image"><img src="${escapeHtml(cover.src)}" alt=""
          style="object-position:${FOCUS_POSITION[cover.focus]}"></div>
        <div class="share-text">
          <span class="mono share-host">reiad.co.uk</span>
          <strong>${escapeHtml(clip(m.title, 60))}</strong>
          <p>${escapeHtml(clip(m.dek, 160)) || "No standfirst, so most apps show the URL here instead."}</p>
        </div>
      </div>
      <ul class="share-notes">
        <li>${m.title.length > 60
          ? `The headline is ${m.title.length} characters and will be cut around 60.`
          : `Headline fits: ${m.title.length} of about 60 characters.`}</li>
        <li>${m.dek.length > 160
          ? `The standfirst is ${m.dek.length} characters and will be cut around 160.`
          : `Standfirst fits: ${m.dek.length} of about 160 characters.`}</li>
        <li>${cover.own
          ? `Drawn from the ${cover.lead ? "lead photo" : "first photo, since none is marked Lead"}, `
            + `cropped to 1200×630 keeping the ${cover.focus}. `
            + "Click a photo in the editor to change which one, or which part."
          : "No photo in the piece, so the section's own card is used. "
            + "Add a photo and mark it Lead to put it here."}</li>
        <li>${cover.own
          ? "The card is drawn and uploaded as a JPEG when you publish: "
            + "WhatsApp, Facebook and LinkedIn will not read the WebP the article itself uses."
          : "Every section has its own card, so a piece without a photo still looks like itself."}</li>
      </ul>
    </div>`;
};

const VIEWS = { article: ARTICLE_VIEW, card: CARD_VIEW, share: SHARE_VIEW };

function renderPreview() {
  const m = meta();

  preview.lang = m.lang;
  preview.innerHTML = (VIEWS[view.mode] ?? ARTICLE_VIEW)(m);

  statLine.textContent =
    `${m.words} word${m.words === 1 ? "" : "s"} · ${m.minutes} min read · ${m.photos} photo${m.photos === 1 ? "" : "s"}`;

  /* The weight meter measures what the server actually limits: the
     BODY, against the 1 MB cap in functions/api/articles. It used to
     measure a whole rendered page against 2 MB, which was the wrong
     number against the wrong limit and read comfortably while the
     real cap was already in sight. A photo still on a data: URL
     costs about 4/3 its bytes here, which is exactly why the meter
     is worth having until it has been uploaded. */
  const bytes = new Blob([m.body ?? ""]).size;
  const kb = Math.round(bytes / 1024);
  const pct = Math.min(100, (bytes / (1024 * 1024)) * 100);
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

/* Tidy the file name as soon as you leave the box, so what is on
   screen is what the URL will be. Doing it on every keystroke would
   fight the typing, a hyphen you are about to follow with a word
   would vanish mid-thought. */
fields.slug.addEventListener("blur", () => {
  const typed = fields.slug.value.trim();
  if (!typed) return;
  const tidy = slugify(typed);
  if (tidy === typed) return;
  fields.slug.value = tidy;
  onEdit();
  toast(`File name tidied to "${tidy}"– that's what the URL can be.`);
});

/* ---------- preview controls ---------- */

const WIDTHS = { phone: "390px", tablet: "768px", full: "100%" };

function applyView() {
  const stage = $("#preview-stage");
  const scroll = $("#preview-scroll");

  // A card and a share box have their own natural size; constraining
  // them to a phone width would only be misleading.
  const constrain = view.mode === "article" ? view.width : "full";
  stage.style.maxWidth = WIDTHS[constrain];
  stage.dataset.width = constrain;

  /* The site's theme switch is :root[data-theme], so it cannot be
     scoped. color-scheme can: it inherits, and the light-dark() in
     every token is resolved where the token is *used*, which is
     inside here. */
  scroll.dataset.previewTheme = view.theme;

  for (const btn of document.querySelectorAll("[data-view]")) {
    btn.setAttribute("aria-pressed", String(btn.dataset.view === view.mode));
  }
  for (const btn of document.querySelectorAll("[data-width]")) {
    btn.setAttribute("aria-pressed", String(btn.dataset.width === view.width));
    // Width is meaningless for the card and share views.
    btn.disabled = view.mode !== "article";
  }
  $("#preview-theme").textContent = `Theme: ${view.theme}`;
}

document.querySelectorAll("[data-view]").forEach((btn) =>
  btn.addEventListener("click", () => {
    view.mode = btn.dataset.view;
    applyView();
    renderPreview();
  })
);

document.querySelectorAll("[data-width]").forEach((btn) =>
  btn.addEventListener("click", () => {
    view.width = btn.dataset.width;
    applyView();
  })
);

const THEME_CYCLE = ["auto", "light", "dark"];
$("#preview-theme").addEventListener("click", () => {
  view.theme = THEME_CYCLE[(THEME_CYCLE.indexOf(view.theme) + 1) % THEME_CYCLE.length];
  applyView();
});


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
  setTopics([]);
  const box = topicInput();
  if (box) box.value = "";
  paintSectionPicker();
  current.slug = null;
  current.section = null;
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
   the publish; a `warn` is worth knowing and never blocks: the
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
  paintTopicOptions();
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
  if (!topics.length) {
    add("warn", "No topics, so the line above the headline will read "
      + `"${m.tag}" and the piece will not be filed under anything.`);
  }

  const doc = new DOMParser().parseFromString(m.body, "text/html");

  /* Which photo becomes the card, said before it is published
     rather than discovered afterwards on somebody's phone. */
  const pick = withDefault(coverFromDocument(doc), m);
  if (pick.own && !pick.lead) {
    add("info", "No photo is marked Lead, so the first one becomes the share card. "
      + "Click a photo to choose another, or which part of it to keep.");
  }

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
    .filter((i) => !isHosted(i.getAttribute("src") ?? ""));
  const offSite = unhosted.filter((i) => isOffSite(i.getAttribute("src")));

  if (unhosted.length && dynamic) {
    add("info", `${unhosted.length} photo${unhosted.length === 1 ? "" : "s"} will be uploaded to /media on publish.`);
  }
  // Worth saying out loud: these are the ones that would rot if the
  // copy failed, because they point at a server nobody here controls.
  if (offSite.length) {
    add("warn", `${offSite.length} photo${offSite.length === 1 ? " is" : "s are"} still hosted elsewhere `
      + `(${new URL(offSite[0].getAttribute("src")).hostname}). Publishing copies `
      + "them here; until then they can disappear without warning.");
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
   6c. OPEN, drafts on this device, articles in the database
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

  /* The pieces that are still committed files, from every section
     rather than from Insights alone: the kitchen and the travel
     desk are written as files too, and leaving them out of this
     list meant the only way to edit one was to open the file.
     Anything already taken over by a database row is listed below
     instead, so the same article never appears twice. */
  const inDatabase = new Set(articles.map((a) => a.slug));
  const files = filePieces().filter((a) => !inDatabase.has(a.slug));

  if (files.length) {
    nodes.push(sectionLabel("Written as files, in the repository"));
    for (const entry of files) {
      const line = document.createElement("div");
      line.className = "admin-line";
      line.append(
        Object.assign(document.createElement("span"), { textContent: entry.title }),
        Object.assign(document.createElement("span"), {
          className: "mono muted",
          textContent: `${findSection(entry.section).en} · ${entry.date ?? ""}`,
        }),
        rowButton("Edit", () => openFile(entry))
      );
      nodes.push(line);
    }
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

/* ---------- articles that are still files ----------

   The pieces written before the Studio existed are committed HTML,
   in aab/insights/, aab/cooking/ and aab/travel/. They are not in
   the database, so Open… could not see them and there was no way to
   change a word of one without editing the file by hand.

   Reading the file back is enough, because worker.js already prefers
   a D1 row over a file at every one of those mounts: publishing what
   comes out of here takes over that URL, and the file stays where it
   is as the fallback if the row is ever removed. */

/** Every piece the site has as a file, in every section, with the
    section it belongs to attached. The desk lists the same set. */
const filePieces = () =>
  SECTIONS.flatMap((sec) =>
    livePieces(sec).map((piece) => ({ ...piece, section: sec.id })));

/** The article body, with the furniture every page repeats stripped. */
function bodyFromPage(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const article = doc.querySelector("article.article");
  if (!article) return null;

  // Everything up to and including the byline is rebuilt from the
  // fields; the disclaimer and the prev/next pair are added back on
  // export. What is left is the piece itself.
  article.querySelectorAll(
    ".eyebrow, h1, .lede, .byline, .prev-next, .engage-block, .read-progress"
  ).forEach((n) => n.remove());
  article.querySelectorAll(".note").forEach((n) => {
    if (/general education, not investment advice/i.test(n.textContent)) n.remove();
  });

  return sanitize(article.innerHTML);
}

async function openFile(entry) {
  /* At its own mount, not at /insights/. Reading a kitchen piece
     from /insights/ is a 404, which is why editing one from here
     used to report that the file could not be read. */
  const section = findSection(entry.section);
  const res = await fetch(pieceUrl(section, entry.slug), { credentials: "same-origin" });
  if (!res.ok) { toast("Couldn't read that file."); return; }

  const body = bodyFromPage(await res.text());
  if (body === null) { toast("That page isn't shaped like an article."); return; }

  current.draftId = newDraftId();
  current.slug = null;          // not in the database yet, so publishing is a first publish
  current.section = null;
  current.notionPageId = null;

  editor.innerHTML = body;
  fields.title.value = entry.title ?? "";
  fields.dek.value = entry.dek ?? "";
  fields.slug.value = entry.slug ?? "";
  fields.date.value = (entry.date ?? "").slice(0, 10) || new Date().toISOString().slice(0, 10);
  fields.lang.value = entry.lang === "bn" ? "bn" : (section.lang === "bn" ? "bn" : "en");
  fields.section.value = section.id;     // wherever the file lives
  paintSectionPicker();
  setTopics(entry.topics?.length ? entry.topics : topicsFromTag(entry.tag));

  openSheet.close();
  onEdit();
  refreshNow();
  toast(`Loaded "${entry.title}" from its file. Publishing takes over that URL.`);
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
  current.section = findSection(article.section).id;
  current.notionPageId = article.notion_page_id ?? null;

  editor.innerHTML = article.body ?? "";
  fields.title.value = article.title ?? "";
  fields.dek.value = article.dek ?? "";
  fields.slug.value = article.slug ?? "";
  fields.date.value = (article.published_at ?? "").slice(0, 10)
    || new Date().toISOString().slice(0, 10);
  fields.lang.value = article.lang === "bn" ? "bn" : "en";
  fields.section.value = findSection(article.section).id;
  paintSectionPicker();
  setTopics(article.topics?.length ? article.topics : topicsFromTag(article.tag));

  openSheet.close();
  onEdit();
  refreshNow();
  toast(`Editing "${article.title}". Publishing updates it in place.`);
}

/* Changing the destination changes the preview, the URL in the bar
   and the note at the foot of the page, so it redraws like any
   other field. */
fields.section?.addEventListener("change", () => {
  paintSectionPicker();
  onEdit();
  refreshNow();
});

$("#btn-open").addEventListener("click", showOpen);
$("#open-close").addEventListener("click", () => openSheet.close());

$("#btn-view").addEventListener("click", () => {
  // Where it is, not where it is going: the picker may already be
  // showing the section this piece is about to be moved to.
  if (current.slug) {
    open(pieceUrl(findSection(current.section), current.slug), "_blank", "noopener");
  }
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
  if (page.tag) setTopics(topicsFromTag(page.tag));
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



/* ============================================================
   8. DRAFTS, IndexedDB (photos blow past localStorage's 5 MB)
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
    return undefined;   // private mode, quota, disabled storage: never fatal
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
      section: current.section,
      notionPageId: current.notionPageId,
      topics: [...topics],
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
    been published from is untouched: this is local only. */
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
  current.section = draft.section ?? null;
  current.notionPageId = draft.notionPageId ?? null;

  editor.innerHTML = draft.html ?? "";
  Object.entries(draft.fields ?? {}).forEach(([k, v]) => {
    if (fields[k]) fields[k].value = v ?? "";
  });
  /* A draft written before sections existed has no section field,
     and Insights is where it would have gone. */
  if (!draft.fields?.section) fields.section.value = "insights";
  paintSectionPicker();
  /* And one written before the label became the topics has its
     label sitting in a field that no longer exists. It is the same
     list, so read it back rather than losing it. */
  setTopics(draft.topics?.length ? draft.topics : topicsFromTag(draft.fields?.tag));
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
  if (current.slug) {
    const live = findSection(current.section);
    const going = currentSection();
    bits.push(`editing ${pieceUrl(live, current.slug)}`);
    // Say it plainly, because publishing will change the address and
    // the old one stops answering the moment it does.
    if (going.id !== live.id) bits.push(`moving to ${pieceUrl(going, current.slug)}`);
  } else {
    bits.push(`new piece for ${currentSection().en}`);
  }
  if (current.notionPageId) bits.push("linked to Notion");
  nowLine.textContent = bits.join(" · ");

  const resync = $("#btn-resync");
  if (resync) resync.hidden = !(dynamic && current.notionPageId);
  const view = $("#btn-view");
  if (view) view.hidden = !(dynamic && current.slug);
}

/* The writing tools stick under the site header while the editor
   scrolls past. All this adds is the shadow: a bar that has
   actually lifted off the pane gets one, a bar sitting where it
   was drawn does not, which is the difference between "floating"
   and "just some buttons".

   A one-pixel sentinel above the bar is watched rather than the
   bar itself: an element with `position: sticky` never stops
   intersecting, so it cannot report its own state. */
function watchTools() {
  const bar = $("#tool-bar");
  if (!bar || !("IntersectionObserver" in window)) return;

  const sentinel = document.createElement("div");
  sentinel.style.cssText = "height:1px;margin-bottom:-1px";
  sentinel.setAttribute("aria-hidden", "true");
  bar.before(sentinel);

  /* Not simply "is it off screen": the sentinel is below the fold
     before anyone scrolls at all, and treating that as stuck put
     a shadow under a bar sitting exactly where it was drawn. It is
     stuck only when the sentinel has gone ABOVE the line. */
  new IntersectionObserver(
    ([entry]) => bar.toggleAttribute(
      "data-stuck",
      entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)
    ),
    { rootMargin: `-${Math.round(parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 66)}px 0px 0px 0px` }
  ).observe(sentinel);
}

/* ============================================================
   Boot
   ============================================================ */
(async () => {
  fields.date.value = new Date().toISOString().slice(0, 10);
  buildSectionPicker();
  wireTopics();
  renderTopics();
  watchTools();

  /* A URL that names a piece is an instruction, and restoring the
     last draft over the top of it is not carrying it out. The two
     used to race: whichever of the draft store and the fetch
     answered second won, so the desk's Edit link opened the right
     piece about half the time. */
  if (!askedFor().wanted) await restoreDraft();
  applyView();
  renderPreview();
  refreshNow();

  // A file piece can be opened without a server; a database one
  // waits for enableDynamic() to say there is one.
  if (askedFor().file) openFromQuery();
})();



/* ============================================================
   9. THE DYNAMIC LAYER
   Switched on only when the gate reports a real server session,
   so a static deployment behaves exactly as it always has.
   ============================================================ */

export function enableDynamic() {
  dynamic = true;
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

  const desk = $("#btn-desk");
  desk.hidden = false;
  // How many people are waiting, without having to go and look.
  Promise.all([api("questions?status=pending"), api("enquiries")]).then(([q, e]) => {
    const n = (q?.questions ?? []).length
      + (e?.enquiries ?? []).filter((row) => row.status === "new").length;
    if (n) desk.textContent = `The desk (${n}) →`;
  });

  refreshSlugs();
  refreshNow();
  openFromQuery();
}

/** What the URL is asking for, if anything. */
function askedFor() {
  const query = new URLSearchParams(location.search);
  const slug = query.get("edit");
  const file = query.get("file");
  return { slug, file, wanted: slug || file };
}

/** The desk's Edit links land here: ?edit=<slug> for a piece in the
    database, ?file=<section>:<slug> for one that is still a file. */
function openFromQuery() {
  const { slug, file } = askedFor();
  if (!slug && !file) return;

  // Drop it from the URL so a reload doesn't discard whatever has
  // been typed since by loading the article over the top of it.
  history.replaceState(null, "", location.pathname);

  if (slug) { openArticle(slug); return; }

  const [section, fileSlug] = String(file).split(":");
  const entry = filePieces()
    .find((p) => p.slug === fileSlug && p.section === findSection(section).id);
  if (entry) openFile(entry);
  else toast("That piece isn't in content.js, so there is nothing to open.");
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
    const hosted = await hostPhotosIn(first.body, slug, uploadMedia, (done, total) => {
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

    /* ---- then the share card ----
       Drawn from the photo the writer marked, at the size and in
       the format the social scrapers actually accept. Failing to
       draw one is not a failure to publish: the section's own card
       is a perfectly good fallback, and the piece is the point. */
    const m = meta();
    const pick = coverFor(m);
    let card = "";
    if (pick.own && storableCover(pick.src)) {
      button.textContent = "Drawing the share card…";
      try {
        const stored = await uploadMedia(await shareCardBlob(pick), cardSlug(slug));
        card = storableCover(stored?.url ?? "");
      } catch (err) {
        console.warn("share card failed", err);
        toast("Couldn't draw the share card, so the section's own is used.");
      }
    }

    /* ---- then the article ---- */
    button.textContent = status === "live" ? "Publishing…" : "Saving…";

    const payload = {
      slug, title: m.title, dek: m.dek, tag: m.tag,
      /* Topics are their own field now. They used to be the label
         split on its middle dot, which turned "Explainer · Equities"
         into the topics "Explainer" and "Equities", and there is no
         such topic as Explainer. */
      topics: m.topics,
      section: m.section,
      lang: m.lang, body: m.body, status, published_at: m.date,
      /* The card if one was drawn, the photo itself if it was not.
         The photo is a WebP and several scrapers will not read one,
         but it is still better than nothing and the server knows
         how to describe it. */
      cover: card || storableCover(pick.src),
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
      current.section = m.section;
      await refreshSlugs();
      refreshNow();
      toast(status === "live"
        ? `Published: ${urlFor(m)}`
        : `Saved as a draft. It isn't public until you publish it.`);
    } else if (result?.reason === "body-too-large") {
      toast(`Still too big at ${Math.round((result.size ?? 0) / 1024)} KB. `
        + "Some photos didn't upload, so they're inflating the article.");
    } else if (result?.reason === "unauthorised") {
      toast("Session expired: reload and sign in again.");
    } else {
      /* There is no "download it instead" any more, and telling
         somebody to do a thing the page cannot do is worse than
         saying nothing. The draft is safe either way: it is held in
         IndexedDB on this device and stays there. */
      toast(result?.message
        || "Couldn't save to the database. Your draft is kept on this device.");
    }
  } finally {
    button.disabled = false;
    button.textContent = label;
    renderPreflight(meta());
  }
}
