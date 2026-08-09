/* ============================================================
   /api/notion — write in Notion, publish here.

   GET /api/notion/status              is this switched on?
   GET /api/notion/pages?q=&db=        admin: what can I import?
   GET /api/notion/pages/<id>          admin: one page, as article HTML
   GET /api/notion/asset?u=<url>       admin: proxy one Notion image

   ---- the shape of the thing ----

   Notion is a block tree; this site is a small, deliberate set of
   HTML tags. The conversion below is therefore lossy on purpose:
   every Notion block maps to something the stylesheet already knows
   how to draw, or it maps to nothing. A callout becomes the site's
   own `note` box, a divider becomes an `<hr>`, and a synced block
   full of database views becomes silence.

   ---- photos ----

   Notion serves uploaded files from S3 on signed URLs that expire in
   about an hour. An imported photo therefore cannot keep the URL it
   arrived with — a piece published on Monday would lose its pictures
   before Tuesday. So an imported image comes back pointing at
   /api/notion/asset, which proxies it same-origin, and the Studio
   then does what it does with any other photo: resize it, re-encode
   it as WebP, and upload it to /media. By the time anything is
   published, no Notion URL survives in the body.

   The proxy is admin-only. An open image proxy on someone else's
   domain is a gift to whoever finds it.

   ---- the token ----

   NOTION_TOKEN is an internal integration token. Absent, every route
   here answers "not configured" and the Studio hides the button,
   which is the same bargain the rest of the dynamic layer makes.
   ============================================================ */

import { fail, methods, notConfigured, ok, str } from "../../_lib/http.js";
import { requireAdmin } from "../../_lib/auth.js";

const API = "https://api.notion.com/v1";
const VERSION = "2022-06-28";

/* Cloudflare counts every outbound fetch against a subrequest budget
   (50 on the free plan), and an import spends one per block page and
   one per image. These caps keep a 200-block page with a photo
   gallery from hitting that ceiling mid-conversion and returning
   half an article — the exact failure this whole branch is about. */
const MAX_BLOCK_FETCHES = 24;
const MAX_DEPTH = 3;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;

/* Where a Notion file can legitimately come from. Anything else and
   the proxy is being asked to fetch something for someone. */
const ASSET_HOSTS =
  /(^|\.)((notion\.so)|(notion-static\.com)|(amazonaws\.com)|(notion\.site))$/i;

/* ============================================================
   The Notion client
   ============================================================ */

function client(token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Notion-Version": VERSION,
    "Content-Type": "application/json",
  };

  return async (path, { method = "GET", body } = {}) => {
    const res = await fetch(`${API}${path}`, {
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

/** Notion accepts ids with or without dashes; its URLs carry the bare
    32 hex characters on the end, which is what gets pasted. */
function normaliseId(raw) {
  const hex = String(raw ?? "").replace(/[^0-9a-fA-F]/g, "").toLowerCase();
  if (hex.length !== 32) return null;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/* ============================================================
   Rich text → inline HTML
   ============================================================ */

function inline(rich) {
  if (!Array.isArray(rich)) return "";
  return rich.map((t) => {
    let html = esc(t.plain_text ?? "");
    if (!html) return "";
    const a = t.annotations ?? {};

    if (a.code) html = `<code>${html}</code>`;
    if (a.bold) html = `<strong>${html}</strong>`;
    // Underline becomes emphasis, the same substitution the Studio's
    // own paste sanitiser makes: the site has one italic and no
    // underline, because an underline on the web means a link.
    if (a.italic || a.underline) html = `<em>${html}</em>`;

    const href = t.href || t.text?.link?.url;
    if (href && SAFE_URL.test(href)) {
      html = `<a href="${esc(href)}" rel="noopener">${html}</a>`;
    }
    return html;
  }).join("");
}

const textOf = (rich) =>
  Array.isArray(rich) ? rich.map((t) => t.plain_text ?? "").join("") : "";

/* ============================================================
   Blocks → the site's HTML
   ============================================================ */

/** A Notion image block → a figure pointing at the proxy. */
function figure(block, origin) {
  const src = block.file?.url || block.external?.url;
  if (!src) return "";
  const caption = inline(block.caption);
  const proxied = `${origin}/api/notion/asset?u=${encodeURIComponent(src)}`;
  return `<figure><img src="${esc(proxied)}" alt="${esc(textOf(block.caption))}" loading="lazy" decoding="async">`
    + (caption ? `<figcaption>${caption}</figcaption>` : "")
    + `</figure>`;
}

function tableHtml(rows, hasHeader) {
  const cell = (c, tag) => `<${tag}>${inline(c)}</${tag}>`;
  const line = (row, tag) =>
    `<tr>${(row.table_row?.cells ?? []).map((c) => cell(c, tag)).join("")}</tr>`;

  const head = hasHeader && rows.length
    ? `<thead>${line(rows[0], "th")}</thead>` : "";
  const rest = (hasHeader ? rows.slice(1) : rows).map((r) => line(r, "td")).join("\n");
  // Wide tables get their own scroller on a phone — the same wrapper
  // the Studio's paste sanitiser adds.
  return `<div class="table-scroll"><table>${head}<tbody>${rest}</tbody></table></div>`;
}

/**
 * Walk a list of sibling blocks into HTML.
 *
 * `state` is shared across the whole import so the recursion can
 * count its own fetches against MAX_BLOCK_FETCHES rather than each
 * branch getting a fresh budget.
 */
async function convert(blocks, { notion, origin, state, depth = 0 }) {
  const out = [];
  let list = null;

  const flush = () => {
    if (!list) return;
    out.push(`<${list.tag}>\n${list.items.join("\n")}\n</${list.tag}>`);
    list = null;
  };

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

      // The page's own H1 is the article headline, so Notion's
      // heading_1 is the site's first in-body level, an h2.
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
      // aside, and the site already styles `note`.
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
        const rows = await fetchBlocks(notion, block.id, state);
        out.push(tableHtml(rows, data.has_column_header));
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
          const label = textOf(data.caption) || href;
          out.push(`<p><a href="${esc(href)}" rel="noopener">${esc(label)}</a></p>`);
        }
        break;
      }

      // A toggle's summary is a sentence and its children are the
      // paragraphs under it; the site has no disclosure widget in an
      // article, so it flattens.
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

/** Every child of a block, following Notion's pagination. */
async function fetchBlocks(notion, id, state) {
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

/* ============================================================
   Page properties → the Studio's fields

   A page loose in a workspace has only a title. A page that is a row
   in a database can carry the rest, so the names below are the ones
   worth using for column headings. Everything is optional.
   ============================================================ */

const FIELD_NAMES = {
  dek: ["dek", "standfirst", "summary", "description", "subtitle", "excerpt"],
  tag: ["tag", "label", "category", "section", "topic"],
  slug: ["slug", "url", "path", "filename"],
  date: ["date", "published", "publish date", "published at"],
  lang: ["lang", "language"],
  status: ["status", "state"],
  topics: ["topics", "tags", "keywords"],
};

/** One property, whatever Notion type it happens to be. */
function propValue(prop) {
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

function readFields(properties = {}) {
  // Match on lowercased names so "Standfirst" and "standfirst" are
  // the same column to whoever set the database up.
  const byName = new Map(
    Object.entries(properties).map(([name, prop]) => [name.trim().toLowerCase(), prop])
  );

  const find = (candidates) => {
    for (const name of candidates) {
      const prop = byName.get(name);
      if (!prop) continue;
      const value = propValue(prop);
      if (Array.isArray(value) ? value.length : value) return value;
    }
    return "";
  };

  const title = Object.values(properties).find((p) => p?.type === "title");

  const out = { title: title ? textOf(title.title) : "" };
  for (const [key, names] of Object.entries(FIELD_NAMES)) out[key] = find(names);

  // A multi-select is the natural shape for topics; a single string
  // is what a text column gives, and the Studio wants a list.
  out.topics = Array.isArray(out.topics)
    ? out.topics
    : String(out.topics || "").split(/[,·|]/).map((t) => t.trim()).filter(Boolean);
  if (Array.isArray(out.tag)) out.tag = out.tag.join(" · ");

  out.lang = String(out.lang || "").toLowerCase().startsWith("bn") ? "bn" : "en";
  out.date = String(out.date || "").slice(0, 10);
  return out;
}

const pageTitle = (page) => {
  const prop = Object.values(page.properties ?? {}).find((p) => p?.type === "title");
  return prop ? textOf(prop.title) : "";
};

/* ============================================================
   Routes
   ============================================================ */

export async function onRequest(context) {
  const { request, env, params } = context;
  const route = params.route ?? [];
  const url = new URL(request.url);

  const token = env.NOTION_TOKEN;
  const head = route[0] ?? "";

  // "Is this available?" has to answer even when it isn't — that is
  // how the Studio decides whether to show the button at all.
  if (head === "status") {
    return methods(request, {
      GET: async () => {
        const guard = await requireAdmin(context);
        if (guard) return guard;
        return ok({ configured: !!token, media: !!env.MEDIA });
      },
    });
  }

  if (!token) return notConfigured();
  const notion = client(token);
  const origin = env.SITE_ORIGIN || url.origin;

  return methods(request, {
    GET: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;

      try {
        /* ---------- proxy one image ---------- */
        if (head === "asset") {
          const target = url.searchParams.get("u");
          if (!target) return fail("url-required");

          let parsed;
          try { parsed = new URL(target); } catch { return fail("bad-url"); }
          if (parsed.protocol !== "https:" || !ASSET_HOSTS.test(parsed.hostname)) {
            return fail("host-not-allowed", 403, { host: parsed.hostname });
          }

          const upstream = await fetch(parsed.toString());
          if (!upstream.ok) return fail("asset-unavailable", upstream.status);

          const type = upstream.headers.get("Content-Type") ?? "application/octet-stream";
          if (!type.startsWith("image/")) return fail("not-an-image", 415, { type });

          return new Response(upstream.body, {
            headers: {
              "Content-Type": type,
              "X-Content-Type-Options": "nosniff",
              // The signed URL behind this expires within the hour,
              // so there is nothing here worth keeping.
              "Cache-Control": "private, max-age=300",
            },
          });
        }

        /* ---------- what can I import? ---------- */
        if (head === "pages" && route.length === 1) {
          const q = str(url.searchParams.get("q"), 100);
          const dbId = normaliseId(url.searchParams.get("db"));

          const result = dbId
            ? await notion(`/databases/${dbId}/query`, {
                method: "POST",
                body: { page_size: 40, ...(q ? {} : {}) },
              })
            : await notion(`/search`, {
                method: "POST",
                body: {
                  ...(q ? { query: q } : {}),
                  filter: { property: "object", value: "page" },
                  sort: { direction: "descending", timestamp: "last_edited_time" },
                  page_size: 40,
                },
              });

          const pages = (result.results ?? [])
            .filter((p) => p.object === "page")
            .map((p) => ({
              id: p.id,
              title: pageTitle(p) || "Untitled",
              edited: p.last_edited_time,
              icon: p.icon?.emoji ?? "",
              parent: p.parent?.type ?? "",
            }))
            .filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || !dbId);

          return ok({ pages });
        }

        /* ---------- one page, converted ---------- */
        if (head === "pages" && route.length === 2) {
          const id = normaliseId(route[1]);
          if (!id) return fail("bad-page-id");

          const page = await notion(`/pages/${id}`);
          const state = { fetches: 0, truncated: false };
          const blocks = await fetchBlocks(notion, id, state);
          const html = await convert(blocks, { notion, origin, state });

          const fields = readFields(page.properties);
          const cover = page.cover?.file?.url || page.cover?.external?.url || "";

          return ok({
            page: {
              id: page.id,
              url: page.url,
              title: fields.title || "Untitled",
              dek: fields.dek || "",
              tag: fields.tag || "",
              topics: fields.topics,
              slug: String(fields.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, ""),
              lang: fields.lang,
              date: fields.date || String(page.created_time ?? "").slice(0, 10),
              status: String(fields.status || "").toLowerCase(),
              body: html,
              cover: cover
                ? `${origin}/api/notion/asset?u=${encodeURIComponent(cover)}`
                : "",
              edited: page.last_edited_time,
            },
            // Say so rather than hand back a short article and let it
            // look finished.
            truncated: state.truncated,
          });
        }

        return fail("not-found", 404);
      } catch (err) {
        if (err.status === 401) {
          return fail("notion-unauthorised", 401, {
            message: "NOTION_TOKEN was rejected. Check the integration still exists.",
          });
        }
        if (err.status === 404) {
          return fail("notion-not-shared", 404, {
            message: "Notion can't see that page. Open it, then Connections → add the integration.",
          });
        }
        if (err.status === 429) {
          return fail("notion-rate-limited", 429, { message: "Notion is throttling. Try again shortly." });
        }
        console.error("notion", err?.stack ?? err);
        return fail("notion-error", 502, { message: String(err?.message ?? err) });
      }
    },
  });
}
