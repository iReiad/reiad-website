/* ============================================================
   _lib/notion.js, turning a Notion page into this site's HTML.

   Kept apart from the route that serves it for one reason: this is
   the intricate half and it is pure, so it can be tested without a
   Worker, a token, or a network. See notion.test.mjs.

   The conversion is lossy on purpose. Notion has infinite block
   types; this site has about twenty tags, listed in
   _lib/sanitise.js, and anything that survives the conversion has
   to survive that allowlist afterwards anyway. So every block maps
   to something the stylesheet already draws, or to nothing at all.
   ============================================================ */

const API = "https://api.notion.com/v1";
const VERSION = "2022-06-28";

/* Cloudflare counts every outbound fetch against a subrequest budget
   (50 on the free plan), and an import spends one per block page,
   one per nested list, and one per table. These caps stop a very
   long page from exhausting that mid-conversion and returning half
   an article, quietly, which is the failure this whole change is
   about. Hitting them sets `truncated` so the Studio can say so. */
export const MAX_BLOCK_FETCHES = 24;
export const MAX_DEPTH = 3;

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;

/* ============================================================
   The client
   ============================================================ */

export function client(token, fetchImpl = fetch) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Notion-Version": VERSION,
    "Content-Type": "application/json",
  };

  return async (path, { method = "GET", body } = {}) => {
    const res = await fetchImpl(`${API}${path}`, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const err = new Error(data?.message || `Notion ${res.status}`);
      err.status = res.status;
      err.code = data?.code;
      throw err;
    }
    return data;
  };
}

/** Notion takes ids with or without dashes; its URLs carry the bare
    32 hex characters on the end, which is the form that gets pasted.

    The id has to be *found* in the string rather than filtered out of
    it: half the letters in "https://notion.so/Some-Title-..." are
    themselves hex digits, so stripping the non-hex characters from a
    URL returns the id with the words still attached to it. */
export function normaliseId(raw) {
  const s = String(raw ?? "");
  const found =
    s.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
    ?? s.match(/[0-9a-f]{32}/i);

  const hex = (found?.[0] ?? "").replace(/-/g, "").toLowerCase();
  if (hex.length !== 32) return null;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`
    + `-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/* ============================================================
   Rich text → inline HTML
   ============================================================ */

export function inline(rich) {
  if (!Array.isArray(rich)) return "";
  return rich.map((t) => {
    let html = esc(t.plain_text ?? "");
    if (!html) return "";
    const a = t.annotations ?? {};

    if (a.code) html = `<code>${html}</code>`;
    if (a.bold) html = `<strong>${html}</strong>`;
    // Underline becomes emphasis, the same substitution the Studio's
    // paste sanitiser makes: the site has one italic and no
    // underline, because an underline on the web means a link.
    if (a.italic || a.underline) html = `<em>${html}</em>`;

    const href = t.href || t.text?.link?.url;
    if (href && SAFE_URL.test(href)) {
      html = `<a href="${esc(href)}" rel="noopener">${html}</a>`;
    }
    return html;
  }).join("");
}

export const textOf = (rich) =>
  Array.isArray(rich) ? rich.map((t) => t.plain_text ?? "").join("") : "";

/* ============================================================
   Blocks → HTML
   ============================================================ */

/** Notion's own file URLs are signed and expire within the hour, so
    an imported image points at our proxy and gets re-hosted by the
    Studio before anything is published. */
export const proxyURL = (origin, url) =>
  `${origin}/api/notion/asset?u=${encodeURIComponent(url)}`;

function figure(data, origin) {
  const src = data.file?.url || data.external?.url;
  if (!src) return "";
  const caption = inline(data.caption);
  return `<figure><img src="${esc(proxyURL(origin, src))}" alt="${esc(textOf(data.caption))}"`
    + ` loading="lazy" decoding="async">`
    + (caption ? `<figcaption>${caption}</figcaption>` : "")
    + `</figure>`;
}

function tableHtml(rows, hasHeader) {
  const line = (row, tag) =>
    `<tr>${(row.table_row?.cells ?? []).map((c) => `<${tag}>${inline(c)}</${tag}>`).join("")}</tr>`;

  const head = hasHeader && rows.length ? `<thead>${line(rows[0], "th")}</thead>` : "";
  const rest = (hasHeader ? rows.slice(1) : rows).map((r) => line(r, "td")).join("\n");
  // Wide tables get their own scroller on a phone: the same wrapper
  // the Studio's paste sanitiser adds.
  return `<div class="table-scroll"><table>${head}<tbody>${rest}</tbody></table></div>`;
}

/** Every child of a block, following Notion's pagination. */
export async function fetchBlocks(notion, id, state) {
  const blocks = [];
  let cursor;
  do {
    if (state.fetches >= MAX_BLOCK_FETCHES) { state.truncated = true; break; }
    state.fetches++;
    const query = new URLSearchParams({ page_size: "100" });
    if (cursor) query.set("start_cursor", cursor);
    const page = await notion(`/blocks/${id}/children?${query}`);
    blocks.push(...(page.results ?? []));
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return blocks;
}

/**
 * Walk a list of sibling blocks into HTML.
 *
 * `state` is shared across the whole import, so the recursion counts
 * its fetches against one budget rather than each branch getting a
 * fresh one.
 */
export async function convert(blocks, { notion, origin, state, depth = 0 }) {
  const out = [];
  let list = null;

  const flush = () => {
    if (!list) return;
    out.push(`<${list.tag}>\n${list.items.join("\n")}\n</${list.tag}>`);
    list = null;
  };

  // Consecutive list items are one list; a different kind of item,
  // or anything that isn't one, closes it.
  const push = (tag, html) => {
    if (list && list.tag !== tag) flush();
    if (!list) list = { tag, items: [] };
    list.items.push(html);
  };

  const childrenOf = async (block) => {
    if (!block.has_children || depth >= MAX_DEPTH) return "";
    if (state.fetches >= MAX_BLOCK_FETCHES) { state.truncated = true; return ""; }
    const kids = await fetchBlocks(notion, block.id, state);
    return convert(kids, { notion, origin, state, depth: depth + 1 });
  };

  for (const block of blocks) {
    const type = block.type;
    const data = block[type] ?? {};

    switch (type) {
      case "paragraph": {
        const html = inline(data.rich_text);
        flush();
        if (html) out.push(`<p>${html}</p>`);
        out.push(await childrenOf(block));
        break;
      }

      // The page's own title is the article headline, so Notion's
      // heading_1 is the first in-body level here, an h2.
      case "heading_1":
      case "heading_2":
        flush();
        out.push(`<h2>${inline(data.rich_text)}</h2>`);
        out.push(await childrenOf(block));
        break;

      case "heading_3":
        flush();
        out.push(`<h3>${inline(data.rich_text)}</h3>`);
        out.push(await childrenOf(block));
        break;

      case "bulleted_list_item":
        push("ul", `<li>${inline(data.rich_text)}${await childrenOf(block)}</li>`);
        break;

      case "numbered_list_item":
        push("ol", `<li>${inline(data.rich_text)}${await childrenOf(block)}</li>`);
        break;

      case "to_do":
        push("ul", `<li>${data.checked ? "<strong>done</strong> " : ""}${inline(data.rich_text)}</li>`);
        break;

      case "quote":
        flush();
        out.push(`<blockquote>${inline(data.rich_text)}${await childrenOf(block)}</blockquote>`);
        break;

      // A callout is the closest thing Notion has to the site's
      // aside, and `note` is already styled.
      case "callout":
        flush();
        out.push(`<div class="note">${inline(data.rich_text)}${await childrenOf(block)}</div>`);
        break;

      case "code":
        flush();
        out.push(`<p><code>${esc(textOf(data.rich_text))}</code></p>`);
        break;

      case "divider":
        flush();
        out.push("<hr>");
        break;

      case "image":
        flush();
        out.push(figure(data, origin));
        break;

      case "table": {
        flush();
        if (state.fetches >= MAX_BLOCK_FETCHES) { state.truncated = true; break; }
        out.push(tableHtml(await fetchBlocks(notion, block.id, state), data.has_column_header));
        break;
      }

      case "bookmark":
      case "embed":
      case "link_preview":
      case "video":
      case "file":
      case "pdf": {
        flush();
        const href = data.url || data.external?.url || data.file?.url;
        if (href && SAFE_URL.test(href)) {
          out.push(`<p><a href="${esc(href)}" rel="noopener">${esc(textOf(data.caption) || href)}</a></p>`);
        }
        break;
      }

      // A toggle's summary is a sentence and its children are the
      // paragraphs under it; an article has no disclosure widget, so
      // it flattens.
      case "toggle": {
        flush();
        const html = inline(data.rich_text);
        if (html) out.push(`<p><strong>${html}</strong></p>`);
        out.push(await childrenOf(block));
        break;
      }

      case "column_list":
      case "column":
      case "synced_block":
        flush();
        out.push(await childrenOf(block));
        break;

      // child_page, child_database, breadcrumb, table_of_contents,
      // equation, unsupported: nothing here has a home on the site.
      default:
        break;
    }
  }

  flush();
  return out.filter(Boolean).join("\n");
}

/* ============================================================
   Page properties → the Studio's fields

   A page loose in a workspace has only a title. A page that is a row
   in a database can carry the rest, so these are the names worth
   giving the columns. All of it is optional.
   ============================================================ */

export const FIELD_NAMES = {
  dek: ["dek", "standfirst", "summary", "description", "subtitle", "excerpt"],
  tag: ["tag", "label", "category", "section", "topic"],
  slug: ["slug", "url", "path", "filename"],
  date: ["date", "published", "publish date", "published at"],
  lang: ["lang", "language"],
  status: ["status", "state"],
  topics: ["topics", "tags", "keywords"],
};

/** One property, whatever Notion type it happens to be. */
export function propValue(prop) {
  if (!prop) return "";
  switch (prop.type) {
    case "title": return textOf(prop.title);
    case "rich_text": return textOf(prop.rich_text);
    case "select": return prop.select?.name ?? "";
    case "status": return prop.status?.name ?? "";
    case "multi_select": return (prop.multi_select ?? []).map((s) => s.name);
    case "date": return prop.date?.start ?? "";
    case "url": return prop.url ?? "";
    case "email": return prop.email ?? "";
    case "number": return prop.number == null ? "" : String(prop.number);
    case "checkbox": return prop.checkbox ? "yes" : "";
    case "created_time": return prop.created_time ?? "";
    case "formula": return prop.formula?.string ?? prop.formula?.number ?? "";
    default: return "";
  }
}

export function readFields(properties = {}) {
  // Matched lowercased, so "Standfirst" and "standfirst" are the same
  // column to whoever set the database up.
  const byName = new Map(
    Object.entries(properties).map(([name, prop]) => [name.trim().toLowerCase(), prop])
  );

  const find = (candidates) => {
    for (const name of candidates) {
      const value = propValue(byName.get(name));
      if (Array.isArray(value) ? value.length : value) return value;
    }
    return "";
  };

  const titleProp = Object.values(properties).find((p) => p?.type === "title");
  const out = { title: titleProp ? textOf(titleProp.title) : "" };
  for (const [key, names] of Object.entries(FIELD_NAMES)) out[key] = find(names);

  // A multi-select is the natural shape for topics; a text column
  // gives one string, and the Studio wants a list either way.
  out.topics = Array.isArray(out.topics)
    ? out.topics
    : String(out.topics || "").split(/[,·|]/).map((t) => t.trim()).filter(Boolean);
  if (Array.isArray(out.tag)) out.tag = out.tag.join(" · ");

  // Whatever the column actually says. "bn" was the only spelling
  // accepted at first, which quietly published every Bangla piece
  // as English: the column usually says "Bangla".
  out.lang = /^(bn|bng|bangla|bengali|bangladesh|বাংলা)/i
    .test(String(out.lang || "").trim()) ? "bn" : "en";
  out.date = String(out.date || "").slice(0, 10);
  out.slug = String(out.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  return out;
}

export const pageTitle = (page) => {
  const prop = Object.values(page.properties ?? {}).find((p) => p?.type === "title");
  return prop ? textOf(prop.title) : "";
};
