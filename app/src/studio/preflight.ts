/* ============================================================
   preflight.ts: the things an editor checks before a piece goes
   out, checked every time instead of when someone remembers.

   An `error` stops the publish. A `warn` is worth knowing and
   never blocks: whether a photo needs alt text is the author's
   decision, not this file's. An `info` is a thing that is about to
   happen, said before it happens rather than discovered afterwards
   on somebody's phone.
   ============================================================ */

import { coverFromDocument } from "/share-card.js";
import { isHosted, isOffSite } from "/photo.js";
import type { Article } from "../api.ts";
import { withDefault, type Meta } from "./piece.ts";

export type Level = "error" | "warn" | "info";
export interface Issue { level: Level; text: string }

export const LEVEL_LABEL: Record<Level, string> = {
  error: "Stops publishing",
  warn: "Worth a look",
  info: "For information",
};

const MAX_BODY_BYTES = 1_000_000;      // matches the server's limit
const DEK_LIMIT = 160;                 // what a search result shows

export function preflight(
  m: Meta,
  { taken, openSlug, dynamic }: {
    /** Slugs already in the database, so a collision is caught
        before the publish rather than by the 409 afterwards. */
    taken: Map<string, Article>;
    /** The slug this editor already owns, if it is editing
        something: replacing that one is the intent, not a clash. */
    openSlug: string | null;
    dynamic: boolean;
  },
): Issue[] {
  const issues: Issue[] = [];
  const add = (level: Level, text: string) => issues.push({ level, text });

  if (!m.title || m.title === "Untitled article") add("error", "It needs a headline.");
  if (!m.body.trim()) add("error", "There's no article in the editor yet.");

  const size = new Blob([m.body]).size;
  if (size > MAX_BODY_BYTES) {
    add("error", `The article is ${Math.round(size / 1024)} KB, over the `
      + `${Math.round(MAX_BODY_BYTES / 1024)} KB limit. Publishing uploads photos to `
      + "/media, which usually fixes this on its own.");
  }

  // A slug that belongs to something else is the one that used to
  // overwrite a live piece without asking.
  const clash = taken.get(m.slug);
  if (clash && clash.slug !== openSlug) {
    add("error", `The file name "${m.slug}" is already `
      + `${clash.status === "live" ? "live" : "a draft"} as "${clash.title}". `
      + "Change it, or open that piece and edit it instead.");
  }

  if (!m.dek) {
    add("warn", "No standfirst. It's what shows under the headline and in search results.");
  } else if (m.dek.length > DEK_LIMIT) {
    add("warn", `The standfirst is ${m.dek.length} characters; `
      + `search results cut off around ${DEK_LIMIT}.`);
  }
  if (!m.topics.length) {
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

  const noAlt = [...doc.querySelectorAll("img")]
    .filter((i) => !i.getAttribute("alt")?.trim());
  if (noAlt.length) {
    add("warn", `${noAlt.length} photo${noAlt.length === 1 ? " has" : "s have"} no alt text, `
      + "so a screen reader has nothing to say about them.");
  }

  // A piece that opens at h3 reads as a fragment to anything
  // parsing the outline, search engines included.
  const levels = [...doc.querySelectorAll("h2, h3")].map((h) => h.tagName);
  if (levels[0] === "H3") add("warn", "The first heading is a sub-heading. Start at H2.");

  const insecure = [...doc.querySelectorAll('a[href^="http://"]')];
  if (insecure.length) {
    add("warn", `${insecure.length} link${insecure.length === 1 ? "" : "s"} still point at `
      + "http://, which browsers flag.");
  }

  const unhosted = [...doc.querySelectorAll("img")]
    .filter((i) => !isHosted(i.getAttribute("src") ?? ""));
  const offSite = unhosted.filter((i) => isOffSite(i.getAttribute("src") ?? ""));

  if (unhosted.length && dynamic) {
    add("info", `${unhosted.length} photo${unhosted.length === 1 ? "" : "s"} will be `
      + "uploaded to /media on publish.");
  }
  // Worth saying out loud: these are the ones that would rot if the
  // copy failed, because they point at a server nobody here controls.
  if (offSite.length) {
    add("warn", `${offSite.length} photo${offSite.length === 1 ? " is" : "s are"} still `
      + `hosted elsewhere (${new URL(offSite[0].getAttribute("src") ?? "").hostname}). `
      + "Publishing copies them here; until then they can disappear without warning.");
  }

  return issues;
}
