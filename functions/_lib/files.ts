/* ============================================================
   _lib/files.ts: the Research Studio's files, in R2.

   RESEARCH.md section 23, "The files". One bucket, the MEDIA
   binding the photos already use, and every key under
   `research/<user id>/<sha256 of the bytes>.<ext>`: the same PDF
   uploaded twice is stored once, and a key can never point at
   different bytes.

   ---- two locks, and the second is the one that matters ----

   The bearer says who is asking. `ownsKey()` says whether the key
   is under that reader's prefix, and it is asked BEFORE the bucket
   is, so a reader who guesses another reader's key is refused by
   arithmetic rather than by a lookup that says "not found" a
   little too slowly. That is the course section's second lock,
   one bucket along.

   ---- a ticket, because pdf.js and <audio> send no header ----

   The bytes are read through `/api/research/file/<key>?t=`, with
   a pass minted by `/api/research/ticket/<key>` for thirty
   minutes: `functions/_lib/ticket.ts`, with this module's own
   label so a course ticket opens nothing here and the other way
   round.

   ---- what is refused ----

   A type not in `FILE_TYPES`, a file over 100 MB, and a file that
   would take the reader over 5 GB. The quota is a listing summed,
   which R2 answers a thousand keys at a time, so a reader with
   more files than that is counted to the end rather than to the
   first page. None of these numbers is in a sentence: the
   Settings meter reads them from `usage()`.
   ============================================================ */

import type { R2Bucket, MediaEnv } from "./r2.ts";
import type { TicketEnv } from "./ticket.ts";
import { sanitiseHTML, textOf } from "./sanitise.ts";
import {
  FILE_CAP, FILE_QUOTA, FILE_TYPES, extOfType, fileKey, ownsKey,
} from "../../shared/research.ts";

export interface FilesEnv extends MediaEnv, TicketEnv {}

/** The ticket label: the research files' own purpose. */
export const RESEARCH_TICKET = "reiad-research-ticket-v1";

export const prefixOf = (userId: string): string => `research/${userId}/`;

/** Everything the reader holds, to the end of the listing. */
export async function usage(bucket: R2Bucket, userId: string): Promise<{ bytes: number; files: number }> {
  let bytes = 0;
  let files = 0;
  let cursor: string | undefined;
  for (;;) {
    const page = await bucket.list({ prefix: prefixOf(userId), limit: 1000, cursor });
    for (const o of page.objects) { bytes += o.size; files += 1; }
    if (!page.truncated || !page.cursor) break;
    cursor = page.cursor;
  }
  return { bytes, files };
}

async function sha256(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type Stored =
  | { ok: true; key: string; ext: string; size: number; already: boolean }
  | { ok: false; reason: string; status: number; extra?: Record<string, unknown> };

/** Store bytes under the reader's prefix. `type` is what the
    browser sent; `ext` may be given where the browser sent a
    generic type for a file whose name says what it is. */
export async function storeFile(
  bucket: R2Bucket, userId: string, buffer: ArrayBuffer, type: string, extHint: string | null,
): Promise<Stored> {
  const ext = extOfType(type) ?? (extHint && extHint in FILE_TYPES ? extHint : null);
  if (!ext) return { ok: false, reason: "unsupported-type", status: 415, extra: { accepts: Object.keys(FILE_TYPES) } };
  if (!buffer.byteLength) return { ok: false, reason: "empty-body", status: 400 };
  if (buffer.byteLength > FILE_CAP) {
    return { ok: false, reason: "too-large", status: 413, extra: { size: buffer.byteLength, limit: FILE_CAP } };
  }
  const key = fileKey(userId, await sha256(buffer), ext);
  const already = await bucket.head(key);
  if (already) return { ok: true, key, ext, size: already.size, already: true };
  const held = await usage(bucket, userId);
  if (held.bytes + buffer.byteLength > FILE_QUOTA) {
    return { ok: false, reason: "over-quota", status: 413, extra: { held: held.bytes, limit: FILE_QUOTA } };
  }
  await bucket.put(key, buffer, {
    httpMetadata: { contentType: FILE_TYPES[ext], cacheControl: "private, max-age=31536000, immutable" },
    customMetadata: { owner: userId },
  });
  return { ok: true, key, ext, size: buffer.byteLength, already: false };
}

/** `bytes=a-b`, `bytes=a-` or `bytes=-n`, or null for the whole
    thing. An unreadable header is the whole thing too, which is
    what the specification says to do with one. */
function parseRange(header: string | null, size: number): { offset: number; length: number } | "bad" | null {
  if (!header) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m) return null;
  if (m[1] === "" && m[2] === "") return null;
  if (m[1] === "") {
    const suffix = Math.min(Number(m[2]), size);
    return suffix > 0 ? { offset: size - suffix, length: suffix } : "bad";
  }
  const offset = Number(m[1]);
  if (offset >= size) return "bad";
  const end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  return { offset, length: end - offset + 1 };
}

/** The bytes, whole or a range. A stored `.html` is served as
    plain text on purpose: a captured page is read by the studio's
    reader through fetch and never opened as a document, so the
    one way it could run anything is closed at the type. */
export async function readFile(bucket: R2Bucket, key: string, rangeHeader: string | null): Promise<Response> {
  const head = await bucket.head(key);
  if (!head) return new Response("not found", { status: 404 });
  const type = key.endsWith(".html")
    ? "text/plain; charset=utf-8"
    : head.httpMetadata?.contentType || "application/octet-stream";
  const common: Record<string, string> = {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=1800",
    ETag: head.httpEtag,
    "Content-Security-Policy": "default-src 'none'; sandbox",
  };
  const range = parseRange(rangeHeader, head.size);
  if (range === "bad") {
    return new Response(null, { status: 416, headers: { ...common, "Content-Range": `bytes */${head.size}` } });
  }
  const object = await bucket.get(key, range ? { range } : undefined);
  if (!object) return new Response("not found", { status: 404 });
  if (!range) {
    return new Response(object.body, { status: 200, headers: { ...common, "Content-Length": String(head.size) } });
  }
  return new Response(object.body, {
    status: 206,
    headers: {
      ...common,
      "Content-Length": String(range.length),
      "Content-Range": `bytes ${range.offset}-${range.offset + range.length - 1}/${head.size}`,
    },
  });
}

/** Everything under the reader's prefix, gone. What the account
    page's erase calls after the rows are. */
export async function removeAll(bucket: R2Bucket, userId: string): Promise<number> {
  let gone = 0;
  for (;;) {
    const page = await bucket.list({ prefix: prefixOf(userId), limit: 1000 });
    if (!page.objects.length) break;
    for (const o of page.objects) { await bucket.delete(o.key); gone += 1; }
    if (!page.truncated) break;
  }
  return gone;
}

export const keyIsMine = (userId: string, key: string): boolean => ownsKey(userId, key);

/* ---------- a web page, captured ----------

   Fetched here rather than in the browser, for the two reasons
   every outside fetch on this site is: connect-src is 'self', and
   a page is a thing to keep a copy of rather than to link, because
   pages change and die. The copy is what the reader shows and what
   the citation's access date refers to. */

const PRIVATE_HOST =
  /^(localhost$|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$|.*\.internal$|.*\.local$)/i;

const UA = "reiad.co.uk research studio (+https://reiad.co.uk/tools/research)";

/** A readability pass without a library: the article, the main,
    or the body, with the furniture cut out of it. Enough for a
    paper's landing page, a blog post and a news piece; a page
    that is all furniture comes back as its title and a link. */
function mainOf(html: string): string {
  let body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;
  for (const tag of ["script", "style", "noscript", "iframe", "svg", "nav", "aside", "footer", "header", "form", "template", "button"]) {
    body = body.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi"), " ");
  }
  body = body.replace(/<!--[\s\S]*?-->/g, " ");
  const inner = /<article\b[^>]*>([\s\S]*?)<\/article>/i.exec(body)?.[1]
    ?? /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(body)?.[1]
    ?? body;
  return inner;
}

/** Relative addresses made absolute, so a captured page's links
    and pictures still point at where they were. */
function absolute(html: string, base: string): string {
  return html.replace(/(href|src)\s*=\s*"([^"]*)"/gi, (whole, attr: string, value: string) => {
    if (/^(https?:|mailto:|#|data:)/i.test(value)) return whole;
    try { return `${attr}="${new URL(value, base).toString()}"`; } catch { return whole; }
  });
}

export type Captured =
  | { ok: true; key: string; size: number; title: string; words: number; already: boolean }
  | { ok: false; reason: string; status: number };

export async function capturePage(bucket: R2Bucket, userId: string, address: string): Promise<Captured> {
  let url: URL;
  try { url = new URL(address); } catch { return { ok: false, reason: "bad-url", status: 400 }; }
  if (url.protocol !== "https:" && url.protocol !== "http:") return { ok: false, reason: "https-only", status: 400 };
  if (PRIVATE_HOST.test(url.hostname)) return { ok: false, reason: "host-not-allowed", status: 403 };
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5" },
      signal: AbortSignal.timeout(15000),
    });
  } catch { return { ok: false, reason: "unreachable", status: 502 }; }
  if (!res.ok) return { ok: false, reason: "unavailable", status: 502 };
  const raw = (await res.text()).slice(0, 5 * 1024 * 1024);
  const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(raw)?.[1] ?? "")
    .replace(/\s+/g, " ").trim().slice(0, 300);
  const clean = sanitiseHTML(absolute(mainOf(raw), url.toString()));
  const text = textOf(clean);
  const words = text.split(/\s+/).filter(Boolean).length;
  const page = `<h2>${title.replace(/</g, "&lt;")}</h2>\n<p><a href="${url.toString()}" rel="noreferrer">${url.hostname}</a></p>\n${clean}`;
  const buffer = new TextEncoder().encode(page).buffer as ArrayBuffer;
  const stored = await storeFile(bucket, userId, buffer, FILE_TYPES.html, "html");
  if (!stored.ok) return { ok: false, reason: stored.reason, status: stored.status };
  return { ok: true, key: stored.key, size: stored.size, title, words, already: stored.already };
}
