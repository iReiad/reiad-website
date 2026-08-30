/* ============================================================
   publish.ts: photos, then the card, then the article.

   In that order, and the order is the whole of it.

   Photos go to /media first and the body is rewritten to point at
   them, which is what keeps a piece under the size limit and what
   stops the same photo being uploaded again on the next save.

   Then the share card, drawn from the photo the writer marked, at
   the size and in the format the social scrapers actually accept.
   Failing to draw one is not a failure to publish: the section's
   own card is a perfectly good fallback, and the piece is the
   point.

   Then the article itself, and a slug that already belongs to
   something else is turned into a question rather than reported as
   a failure. It used to overwrite a live piece without asking.
   ============================================================ */

import { hostPhotosIn } from "/photo.js";
import { shareCardBlob, cardSlug, drawingForPiece } from "/share-card.js";
import { uploadMedia } from "../site.ts";
import { api } from "../api.ts";
import { coverFor, storableCover, urlFor, type Meta, type Tied } from "./piece.ts";

export interface PublishResult {
  ok: boolean;
  /** The rewritten body, when photos moved. The caller puts it back
      into the editor: leaving the data URLs in place would mean
      re-uploading the same photos on the next save, and would keep
      the draft in IndexedDB megabytes larger than it needs to be. */
  body?: string;
  message: string;
}

export async function publish({
  status, meta, tied, say, remeta,
}: {
  status: "live" | "draft";
  meta: Meta;
  tied: Tied;
  /** Progress, on the button and in a toast. */
  say: (text: string) => void;
  /** Re-read the article after the photos moved: the cover has to
      be picked from the rewritten body, not the one that still has
      data URLs in it. */
  remeta: (body: string) => Meta;
}): Promise<PublishResult> {
  const slug = meta.slug;

  /* ---- photos first ---- */
  say("Uploading photos…");
  const hosted = await hostPhotosIn(meta.body, slug, uploadMedia, (done, total) => {
    say(`Uploading photo ${done} of ${total}…`);
  });

  let body = meta.body;
  let notice = "";
  if (hosted.uploaded) body = hosted.html;
  if (hosted.failed) {
    notice = `${hosted.failed} photo${hosted.failed === 1 ? "" : "s"} wouldn't upload. `
      + "They're still in the article, but embedded.";
  }

  const m = hosted.uploaded ? remeta(body) : meta;

  /* ---- then the share card ---- */
  const pick = coverFor(m);
  let card = "";
  /* EVERY PIECE GETS ONE NOW, illustrated or not. The card is
     drawn in the site's own material rather than being a crop of
     a photograph, so a piece with no photo has a card with the
     rail, the ground, the light and its own title on it, which is
     a better thing to paste into a chat than the section's
     standing card. A photo, where there is one, is what that card
     stands on. */
  const withPhoto = pick.own && storableCover(pick.src);
  say("Drawing the share card…");
  try {
    /* WHICH OF THE TWELVE THIS PIECE WEARS, and its wall.

       Asked for rather than worked out here: `shared/art.ts` is
       the one place that decides and this bundle cannot import
       it, so `/api/admin/art` answers with the choice and the
       drawings in one request. A piece whose drawings do not
       arrive gets the room with nothing standing in it, which is
       still the site's own card. */
    const drawing = await drawingForPiece({
      id: slug, section: m.section, title: m.title,
      tags: [m.tag, ...(m.topics ?? [])],
    });
    const stored = await uploadMedia(
      await shareCardBlob(
        withPhoto ? pick : { src: "", focus: pick.focus },
        { title: m.title, kicker: m.tag, section: m.section },
        drawing),
      cardSlug(slug));
    card = storableCover(stored?.url ?? "");
  } catch (err) {
    console.warn("share card failed", err);
    notice = "Couldn't draw the share card, so the section's own is used.";
  }

  /* ---- then the article ---- */
  say(status === "live" ? "Publishing…" : "Saving…");

  const payload = {
    slug, title: m.title, dek: m.dek, tag: m.tag,
    /* Topics are their own field. They used to be the label split
       on its middle dot, which turned "Explainer · Equities" into
       the topics "Explainer" and "Equities", and there is no such
       topic as Explainer. */
    topics: m.topics,
    section: m.section,
    lang: m.lang, body: m.body, status, published_at: m.date,
    /* The card if one was drawn, the photo itself if it was not.
       The photo is a WebP and several scrapers will not read one,
       but it is still better than nothing and the server knows how
       to describe it. */
    cover: card || storableCover(pick.src),
    notion_page_id: tied.notionPageId ?? undefined,
    // Editing something already opened from the database is the one
    // case where replacing it is exactly the intent.
    overwrite: tied.slug === slug,
  };

  let result = await api<{ existing?: { title: string; status: string } }>(
    "articles", { method: "POST", timeout: 60_000, body: payload });

  if (result && !result.ok && result.reason === "slug-exists") {
    const existing = (result as { existing?: { title: string; status: string } }).existing ?? {
      title: "something else", status: "draft",
    };
    const yes = confirm(
      `"${existing.title}" already uses the file name ${slug}, and it is `
      + `${existing.status === "live" ? "live" : "a draft"}.\n\n`
      + "Replace it with what's in the editor? There's no undo."
    );
    if (!yes) {
      return { ok: false, body: hosted.uploaded ? body : undefined,
        message: "Left it alone. Change the file name to publish this separately." };
    }
    result = await api("articles", {
      method: "POST", timeout: 60_000, body: { ...payload, overwrite: true },
    });
  }

  if (result?.ok) {
    return {
      ok: true,
      body: hosted.uploaded ? body : undefined,
      message: [
        status === "live"
          ? `Published: ${urlFor(m)}`
          : "Saved as a draft. It isn't public until you publish it.",
        notice,
      ].filter(Boolean).join(" "),
    };
  }

  const reason = result && !result.ok ? result.reason : "";
  const size = (result as { size?: number } | null)?.size ?? 0;

  return {
    ok: false,
    body: hosted.uploaded ? body : undefined,
    message:
      reason === "body-too-large"
        ? `Still too big at ${Math.round(size / 1024)} KB. `
          + "Some photos didn't upload, so they're inflating the article."
      : reason === "unauthorised"
        ? "Session expired: reload and sign in again."
        /* There is no "download it instead" any more, and telling
           somebody to do a thing the page cannot do is worse than
           saying nothing. The draft is safe either way: it is held
           in IndexedDB on this device and stays there. */
        : "Couldn't save to the database. Your draft is kept on this device.",
  };
}
