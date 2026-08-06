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

/** Turn arbitrary HTML into the small set of tags the site styles. */
export function sanitize(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

  doc.body.querySelectorAll("script, style, meta, link, iframe, object, embed, form, input, button")
    .forEach((n) => n.remove());

  const walk = (node) => {
    [...node.children].forEach(walk);

    let tag = node.tagName;
    if (!KEEP.has(tag) && RENAME[tag]) {
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
    } else if (!KEEP.has(tag)) {
      node.replaceWith(...node.childNodes);
      return;
    }

    // scrub attributes down to the allowlist
    const allowed = ATTRS[tag] ?? [];
    [...node.attributes].forEach((a) => {
      if (!allowed.includes(a.name.toLowerCase())) node.removeAttribute(a.name);
    });

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
   2. PHOTOS — resize, re-encode, embed
   ============================================================ */

const MAX_EDGE = 1600;      // px on the long side — plenty for a blog
const QUALITY = 0.82;

/** File/Blob → a WebP data URL, downscaled and stripped of EXIF. */
async function processImage(file) {
  const bitmap = await createImageBitmap(file);
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
  return { url: await blobToDataURL(blob), width: w, height: h, type: blob.type };
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
  return `<figure><img src="${url}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async"><figcaption>Caption — click to edit, or delete this line</figcaption></figure><p><br></p>`;
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
      toast("That photo couldn't be read — try a JPG or PNG.");
    }
  }
  onEdit();
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
  if (cap && cap.textContent.startsWith("Caption — click to edit")) {
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

const CAPTION_HINT = "Caption — click to edit";

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
  <title>${escapeHtml(m.title)} — Rony Reiad</title>
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
        fees change — confirm the current details with the relevant institution
        before acting on anything here.
      </div>

      <div class="prev-next">
        <a href="/insights.html">
          <span class="mono">All insights</span>
          <strong>Back to the index →</strong>
        </a>
        <a href="/learn/index.html">
          <span class="mono">শেখার লাইব্রেরি</span>
          <strong>Learn hub — বাংলায় →</strong>
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
}

Object.values(fields).forEach((el) => el.addEventListener("input", onEdit));

/* ============================================================
   6. EXPORT
   ============================================================ */

$("#btn-html").addEventListener("click", () => {
  const m = meta();
  if (!guard(m)) return;
  download(`${m.slug}.html`, buildPage(m));
  toast(`Saved ${m.slug}.html — drop it in /insights/`);
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
  toast(`Saved ${m.slug}.zip — ${files.length} photo file(s) inside`);
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

$("#btn-clear").addEventListener("click", async () => {
  if (!confirm("Clear the editor and start a new article? The saved draft goes too.")) return;
  editor.replaceChildren();
  Object.values(fields).forEach((el) => {
    if (el.type === "date") el.value = new Date().toISOString().slice(0, 10);
    else if (el.tagName !== "SELECT") el.value = "";
  });
  await clearDraft();
  onEdit();
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

let saveTimer;
function saveDraft() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const draft = {
      savedAt: Date.now(),
      html: editor.innerHTML,
      fields: Object.fromEntries(
        Object.entries(fields).map(([k, el]) => [k, el.value])
      ),
    };
    await idb("readwrite", (store) => store.put(draft, "current"));
    draftLine.textContent = `Draft saved ${new Date().toLocaleTimeString()}`;
  }, 700);
}

const clearDraft = () => idb("readwrite", (store) => store.delete("current"));

async function restoreDraft() {
  const draft = await idb("readonly", (store) => store.get("current"));
  if (!draft) return false;
  editor.innerHTML = draft.html ?? "";
  Object.entries(draft.fields ?? {}).forEach(([k, v]) => {
    if (fields[k] && v) fields[k].value = v;
  });
  draftLine.textContent = `Draft restored from ${new Date(draft.savedAt).toLocaleString()}`;
  return true;
}

/* ============================================================
   Boot
   ============================================================ */
(async () => {
  fields.date.value = new Date().toISOString().slice(0, 10);
  await restoreDraft();
  renderPreview();
})();

