/* ============================================================
   _lib/notion.ts, turning a Notion page into this site's HTML.

   Kept apart from the route that serves it for one reason: this is
   the intricate half and it is pure, so it can be tested without a
   Worker, a token, or a network. See notion.test.ts.

   The conversion is lossy on purpose. Notion has infinite block
   types; this site has about twenty tags, listed in
   _lib/sanitise.ts, and anything that survives the conversion has
   to survive that allowlist afterwards anyway. So every block maps
   to something the stylesheet already draws, or to nothing at all.
   ============================================================ */

/* ---- what a Notion payload is ----

   These were `_lib/notion.d.ts`, a hand-written declaration beside
   a JavaScript module. A module that has been converted describes
   itself, so they live here and that file is gone. */

/** One run of Notion rich text. */
export interface RichText {
  plain_text?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
  };
  href?: string | null;
  text?: { link?: { url?: string } | null } | null;
}

/** A block, which carries its own data under a key named by its
    type: a paragraph has a `paragraph`. That is what the index
    signature is, rather than a way of allowing anything. */
export interface Block {
  id?: string;
  type?: string;
  has_children?: boolean;
  [data: string]: unknown;
}

/** Whatever Notion answered. `results` and the two pagination
    fields are what this module reads; the index signature is for
    the callers that read a page's own properties off it, and is
    `unknown` rather than `any` so they have to look. */
export interface NotionResponse {
  results?: Block[];
  has_more?: boolean;
  next_cursor?: string | null;
  [key: string]: unknown;
}

/** The client `convert` is handed: a path in, Notion's answer out.
    The test passes a fake one, which is the whole reason this
    module takes it as an argument. The options exist for the two
    callers that POST (search, and a database query); everything in
    this file GETs and passes none. */
export type NotionFetch = (
  path: string,
  options?: { method?: string; body?: unknown },
) => Promise<NotionResponse>;

/** What the client throws. Notion answers a JSON body with its own
    `code` in it and an HTTP status, and the route turns each into a
    different sentence for the writer: 401 is a bad token, 404 is a
    page the integration has not been given. A plain `Error` loses
    both, so it is a class rather than two properties bolted on to
    one. */
export class NotionError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "NotionError";
    this.status = status;
    this.code = code;
  }
}

/** Shared across one import, so the recursion counts its fetches
    against a single budget. `truncated` is how a half-converted
    page says so. */
export interface ConvertState {
  fetches: number;
  truncated: boolean;
}

/** One property of a Notion page, whatever type it happens to be.

    Every field here is read by `propValue` below and the two lists
    have to stay the same length: a case in that switch reading a
    field absent from this interface is the shape of the bug the
    hand-written declaration beside the old `.js` had. */
export interface NotionProperty {
  type?: string;
  title?: RichText[];
  rich_text?: RichText[];
  select?: { name?: string } | null;
  status?: { name?: string } | null;
  multi_select?: Array<{ name?: string }>;
  date?: { start?: string } | null;
  url?: string | null;
  email?: string | null;
  number?: number | null;
  checkbox?: boolean;
  created_time?: string;
  formula?: { string?: string | null; number?: number | null } | null;
}

/** What a page's columns come out as.

    `dek` and `status` are whatever the column was, because a
    multi-select answers a list and neither is folded back into a
    string. `tag`, `topics`, `date`, `lang` and `slug` are, which
    is why they are narrower here. */
export interface Fields {
  title: string;
  dek: string | string[];
  tag: string;
  slug: string;
  date: string;
  lang: "bn" | "en";
  status: string | string[];
  topics: string[];
}

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

const ESCAPES: Record<string, string> =
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

export const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ESCAPES[c]);

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;

/* ============================================================
   The client
   ============================================================ */

export function client(token: string, fetchImpl: typeof fetch = fetch): NotionFetch {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Notion-Version": VERSION,
    "Content-Type": "application/json",
  };

  return async (path, { method = "GET", body } = {}) => {
    const res = await fetchImpl(`${API}${path}`, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    });
    /* Notion answers JSON for an error as well as for a success, and
       a gateway in front of it may answer neither. `null` on a parse
       failure is why every read below goes through `?.`. */
    const data = await res.json().catch(() => null) as
      { message?: string; code?: string } & NotionResponse | null;
    if (!res.ok) {
      throw new NotionError(
        data?.message || `Notion ${res.status}`, res.status, data?.code ?? "",
      );
    }
    return data ?? {};
  };
}

/** Notion takes ids with or without dashes; its URLs carry the bare
    32 hex characters on the end, which is the form that gets pasted.

    The id has to be *found* in the string rather than filtered out of
    it: half the letters in "https://notion.so/Some-Title-..." are
    themselves hex digits, so stripping the non-hex characters from a
    URL returns the id with the words still attached to it. */
export function normaliseId(raw: unknown): string | null {
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

export function inline(rich: RichText[] | undefined): string {
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

export const textOf = (rich: RichText[] | undefined): string =>
  Array.isArray(rich) ? rich.map((t) => t.plain_text ?? "").join("") : "";

/* ============================================================
   Blocks → HTML
   ============================================================ */

/** Notion's own file URLs are signed and expire within the hour, so
    an imported image points at our proxy and gets re-hosted by the
    Studio before anything is published. */
export const proxyURL = (origin: string, url: string): string =>
  `${origin}/api/notion/asset?u=${encodeURIComponent(url)}`;

/** The data hanging off one block, which is whatever its type
    carries. Read field by field with `?.`, because the block type is
    a string and TypeScript cannot know which of these it brought. */
interface BlockData {
  rich_text?: RichText[];
  caption?: RichText[];
  file?: { url?: string };
  external?: { url?: string };
  url?: string;
  checked?: boolean;
  has_column_header?: boolean;
  table_row?: { cells?: RichText[][] };
}

function figure(data: BlockData, origin: string): string {
  const src = data.file?.url || data.external?.url;
  if (!src) return "";
  const caption = inline(data.caption);
  return `<figure><img src="${esc(proxyURL(origin, src))}" alt="${esc(textOf(data.caption))}"`
    + ` loading="lazy" decoding="async">`
    + (caption ? `<figcaption>${caption}</figcaption>` : "")
    + `</figure>`;
}

function tableHtml(rows: Block[], hasHeader: boolean): string {
  const line = (row: Block, tag: "th" | "td") => {
    const cells = (row.table_row as BlockData["table_row"])?.cells ?? [];
    return `<tr>${cells.map((c) => `<${tag}>${inline(c)}</${tag}>`).join("")}</tr>`;
  };

  const head = hasHeader && rows.length ? `<thead>${line(rows[0], "th")}</thead>` : "";
  const rest = (hasHeader ? rows.slice(1) : rows).map((r) => line(r, "td")).join("\n");
  // Wide tables get their own scroller on a phone: the same wrapper
  // the Studio's paste sanitiser adds.
  return `<div class="table-scroll"><table>${head}<tbody>${rest}</tbody></table></div>`;
}

/** Every child of a block, following Notion's pagination. */
export async function fetchBlocks(
  notion: NotionFetch, id: string, state: ConvertState,
): Promise<Block[]> {
  const blocks: Block[] = [];
  let cursor: string | null = null;
  do {
    if (state.fetches >= MAX_BLOCK_FETCHES) { state.truncated = true; break; }
    state.fetches++;
    const query = new URLSearchParams({ page_size: "100" });
    if (cursor) query.set("start_cursor", cursor);
    const page = await notion(`/blocks/${id}/children?${query}`);
    blocks.push(...(page.results ?? []));
    cursor = page.has_more ? page.next_cursor ?? null : null;
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
export async function convert(
  blocks: Block[],
  { notion, origin, state, depth = 0 }: {
    notion: NotionFetch; origin: string; state: ConvertState; depth?: number;
  },
): Promise<string> {
  const out: string[] = [];
  let list: { tag: "ul" | "ol"; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    out.push(`<${list.tag}>\n${list.items.join("\n")}\n</${list.tag}>`);
    list = null;
  };

  // Consecutive list items are one list; a different kind of item,
  // or anything that isn't one, closes it.
  const push = (tag: "ul" | "ol", html: string) => {
    if (list && list.tag !== tag) flush();
    if (!list) list = { tag, items: [] };
    list.items.push(html);
  };

  const childrenOf = async (block: Block): Promise<string> => {
    if (!block.has_children || !block.id || depth >= MAX_DEPTH) return "";
    if (state.fetches >= MAX_BLOCK_FETCHES) { state.truncated = true; return ""; }
    const kids = await fetchBlocks(notion, block.id, state);
    return convert(kids, { notion, origin, state, depth: depth + 1 });
  };

  for (const block of blocks) {
    const type = block.type ?? "";
    const data = (block[type] ?? {}) as BlockData;

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
        if (!block.id) break;
        out.push(tableHtml(
          await fetchBlocks(notion, block.id, state), !!data.has_column_header,
        ));
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
export function propValue(prop: NotionProperty | undefined): string | string[] {
  if (!prop) return "";
  switch (prop.type) {
    case "title": return textOf(prop.title);
    case "rich_text": return textOf(prop.rich_text);
    case "select": return prop.select?.name ?? "";
    case "status": return prop.status?.name ?? "";
    case "multi_select": return (prop.multi_select ?? []).map((s) => s.name ?? "");
    case "date": return prop.date?.start ?? "";
    case "url": return prop.url ?? "";
    case "email": return prop.email ?? "";
    case "number": return prop.number == null ? "" : String(prop.number);
    case "checkbox": return prop.checkbox ? "yes" : "";
    case "created_time": return prop.created_time ?? "";
    /* A number formula came back as a number and every caller
       stringified it anyway. It is stringified once, here. */
    case "formula": return prop.formula?.string
      ?? (prop.formula?.number == null ? "" : String(prop.formula.number));
    default: return "";
  }
}

type FieldName = keyof typeof FIELD_NAMES;

export function readFields(properties: Record<string, NotionProperty> = {}): Fields {
  // Matched lowercased, so "Standfirst" and "standfirst" are the same
  // column to whoever set the database up.
  const byName = new Map(
    Object.entries(properties).map(([name, prop]) => [name.trim().toLowerCase(), prop])
  );

  const find = (candidates: string[]): string | string[] => {
    for (const name of candidates) {
      const value = propValue(byName.get(name));
      if (Array.isArray(value) ? value.length : value) return value;
    }
    return "";
  };

  const titleProp = Object.values(properties).find((p) => p?.type === "title");

  /* Read out of FIELD_NAMES rather than named seven times over, so
     adding a column name stays one edit. What comes back is whatever
     the column was, which is why the returned object narrows each
     one rather than spreading this. */
  const raw = {} as Record<FieldName, string | string[]>;
  for (const key of Object.keys(FIELD_NAMES) as FieldName[]) raw[key] = find(FIELD_NAMES[key]);

  return {
    title: titleProp ? textOf(titleProp.title) : "",
    dek: raw.dek,
    status: raw.status,
    tag: Array.isArray(raw.tag) ? raw.tag.join(" · ") : raw.tag,
    // A multi-select is the natural shape for topics; a text column
    // gives one string, and the Studio wants a list either way.
    topics: Array.isArray(raw.topics)
      ? raw.topics
      : String(raw.topics || "").split(/[,·|]/).map((t) => t.trim()).filter(Boolean),
    // Whatever the column actually says. "bn" was the only spelling
    // accepted at first, which quietly published every Bangla piece
    // as English: the column usually says "Bangla".
    lang: /^(bn|bng|bangla|bengali|bangladesh|বাংলা)/i
      .test(String(raw.lang || "").trim()) ? "bn" : "en",
    date: String(raw.date || "").slice(0, 10),
    slug: String(raw.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, ""),
  };
}

/** A Notion page, as much of one as anything here reads. Narrow on
    purpose: a page carries dozens of fields and this repository
    asks it three questions. */
export interface NotionPage {
  /** "page" or "database". The search endpoint answers both and
      only the first is importable. */
  object?: string;
  id?: string;
  url?: string;
  created_time?: string;
  last_edited_time?: string;
  icon?: { emoji?: string } | null;
  /** A page's own cover photo, which becomes the piece's lead. Two
      shapes because Notion stores an uploaded file and a linked one
      differently, and both arrive here. */
  cover?: { file?: { url?: string }; external?: { url?: string } } | null;
  properties?: Record<string, NotionProperty>;
}

export const pageTitle = (page: NotionPage): string => {
  const prop = Object.values(page.properties ?? {}).find((p) => p?.type === "title");
  return prop ? textOf(prop.title) : "";
};
