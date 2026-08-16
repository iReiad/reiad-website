/* ============================================================
   notion.ts: the three Notion calls, typed.

   The paths and the timeouts are `/api.js`'s, copied nowhere: the
   calls go through the same `api()` every other request on this
   site uses. What this file adds is what each one answers with,
   and the timeouts, which are long because converting a page of
   any length is Notion's block API paged over the wire.

   The conversion happens on the server, so what arrives is already
   the small set of tags the site styles, with its photos pointed
   at the same-origin proxy so they survive long enough to be
   re-hosted.
   ============================================================ */

import { api, type Reply } from "../api.ts";

export interface NotionPage {
  id: string;
  title: string;
  dek?: string;
  tag?: string;
  date?: string;
  lang?: string;
  slug?: string;
  body: string;
}

export interface NotionRow {
  id: string;
  title: string;
  icon?: string;
  edited?: string;
}

/** Is the integration actually configured? The button stays hidden
    until this says yes, so it never offers something that answers
    "not configured". */
export const notionStatus = () =>
  api<{ configured: boolean }>("notion/status");

export const notionPages = (query: string): Promise<Reply<{ pages: NotionRow[] }> | null> =>
  api(`notion/pages${query ? `?q=${encodeURIComponent(query)}` : ""}`, { timeout: 20_000 });

export const notionPage = (id: string) =>
  api<{ page: NotionPage; truncated?: boolean }>(
    `notion/pages/${encodeURIComponent(id)}`, { timeout: 45_000 });
