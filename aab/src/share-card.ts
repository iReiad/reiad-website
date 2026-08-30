/* ============================================================
   share-card.ts: the picture a pasted link shows.

   THE BUG THIS FILE EXISTS FOR

   A photo in an article showed up on the Studio's share preview
   and then, on the published piece, WhatsApp and LinkedIn drew the
   site's default card instead. Nothing was wrong with the tag. The
   photo was a WebP, because every photo here is re-encoded to WebP
   on the way in, and the scrapers behind Facebook, WhatsApp and
   LinkedIn will not read one: they ask for the image, fail, and
   fall back to whatever else they can find.

   The other half of the problem is shape. A card is 1200x630. A
   photo is whatever the camera made it, and a portrait photo in a
   landscape slot gets cropped by whoever is drawing the card, in
   whichever direction they feel like.

   So the card is drawn here, once, when a piece is published: a
   real 1200x630 JPEG, cropped around the part of the photo the
   writer said to keep, uploaded like any other photo and stored as
   the article's cover.

   ---- and it is drawn as this site, not as a photograph ----

   A cropped photo with nothing else on it is somebody's
   photograph. A card that arrives in a chat should look like the
   place it came from before anybody reads the title, so the card
   carries the site's own material: the accent rail down the left
   edge that every `<GoCard>` has, the accent-lit ground the
   scenes stand on, a shaft of light across it, the hairline rim,
   the piece's kicker in the mono face and its title in the serif.

   A piece with no photograph gets all of that and no photograph,
   which means EVERY piece can have a card of its own now. It used
   to be the section's standing card for anything unillustrated.

   ---- it is always the dark one, and that is not a shortcut ----

   Every other picture on this site answers the theme. A JPEG in
   somebody's chat window cannot: it is drawn once, at publish,
   and looked at by a thousand people whose settings this site
   will never see. So the palette is read with `<html>` held at
   dark for the length of one synchronous style read, which is
   also why it is READ rather than typed: the card follows the
   tokens, so a change to the site's greens changes the cards
   without anybody remembering this file.

   It lives in its own file because two places need it. The Studio
   draws one on publish; the desk draws one for a piece published
   before any of this existed, without making anyone open the
   editor to fix a picture.

   ---- this file is TypeScript, and the .js beside it is built ----

   archive/TRANSITION.md Stage 13, and the first module to move. Edit
   `aab/src/share-card.ts`; `node scripts/build-modules.ts`
   writes `aab/share-card.js`, which is what the browser fetches
   and what is committed. `scripts/build-modules.ts` rebuilds and
   compares, so an edit to the output alone fails a check rather
   than being quietly overwritten by the next build.

   The output is committed for the reason section 7 of
   archive/TRANSITION.md gives: the site deploys by uploading `aab/` with
   no build step in CI, and adding one would put a build command
   in a dashboard that cannot be seen from this repository.
   ============================================================ */

export const SHARE_W = 1200;
export const SHARE_H = 630;

/** Where to crop a photo that does not fit, in the writer's own
    words. The same three values the figure toolbar sets as a
    class on the figure. */
export type Focus = "top" | "bottom" | "centre";

/** Which photo a card should be drawn from, and where to crop it.

    `own` is false when the piece has no photo of its own, in which
    case the section's standing card is the right answer and
    nothing should be drawn. `lead` says the photo was the marked
    lead rather than merely the first one found. */
export interface Cover {
  src: string;
  focus: Focus;
  own: boolean;
  lead: boolean;
}

/** Which part of the photo to keep when the crop throws some away. */
const OFFSET: Record<Focus, (h: number) => number> = {
  top: () => 0,
  bottom: (h) => SHARE_H - h,
  centre: (h) => (SHARE_H - h) / 2,
};

/** What the card is about, beside the photograph.

    All of it optional, because two callers built one from a
    `Cover` alone for a year and a card with no words on it is
    still a better card than a section's standing one. */
export interface CardWords {
  title?: string;
  /** The tag, in the mono face above the title. */
  kicker?: string;
  /** Which desk it is on: `insights`, `cooking`, `travel`. The
      card takes that section's own colour, so a kitchen piece
      shares as rose and a travel piece as plum.

      Resolved out of the RAIL rather than out of a table here,
      and that is the point. `shared/nav.ts` is the one place a
      section's colour is written down, the rail renders every
      section with that colour inline on the link, and this page
      has a rail on it: reading it is reading the one table
      through the markup it already produced. A copy of six
      colours in this file would be the failure CLAUDE.md opens
      with, and putting `nav.ts` on the wire as a served module to
      carry a hue would cost a module, a precache entry and a
      service worker bump.

      Falls back to the site's own green, which is what a piece on
      a desk the rail does not list should share as anyway. */
  section?: string;
  /** The token directly, for anything that already has it and
      for a caller with no rail to read. */
  accent?: string;
}

/** A section's colour, out of the rail. Returns a token name so
    the stylesheet is what resolves it. */
function accentOf(words: CardWords): string {
  if (words.accent) return words.accent;
  if (!words.section || typeof document === "undefined") return "--green";
  const link = document.querySelector(
    `.rail-item[href="/${words.section}"], .rail-item[href^="/${words.section}/"]`);
  const inline = link instanceof HTMLElement
    ? link.style.getPropertyValue("--accent").trim() : "";
  /* `var(--rose)` back to `--rose`, because `palette()` builds
     `var(<token>, var(--green))` round it and a nested `var()`
     inside a fallback is legal but pointless. */
  const named = /^var\(\s*(--[a-z-]+)/.exec(inline);
  return named ? named[1] : "--green";
}

/** The six colours a card is drawn in, resolved from the
    stylesheet rather than typed here. */
interface Palette {
  accent: string; hot: string; ground: string; sink: string;
  ink: string; soft: string;
  /** The nine `--art-*` tokens a drawing is allowed to name, by
      the name it names them with, already resolved. A drawing is
      markup with `var(--art-lit)` in it and an SVG rasterised out
      of a blob has no page to inherit from, so the tokens are
      substituted into the string before it is ever parsed. That
      is more robust than a `<style>` block inside the SVG as
      well: it needs no custom-property support from whatever is
      doing the rasterising. */
  art: Record<string, string>;
}

/** The nine tokens the twelve drawings and six walls between them
    actually name. Asserted against the strings by
    `scripts/check-art.ts`, so a drawing that reaches for a tenth
    fails a check rather than rendering that shape in black. */
export const ART_TOKENS = [
  "lit", "hot", "mid", "deep", "shade", "sink",
  "fore-hot", "fore-lit", "fore-mid",
] as const;

/* The dark palette is the card's palette, whatever the person
   publishing has their own site set to: see the note at the top.
   `<html>` is held at dark for the length of one synchronous
   read, with nothing awaited in between, so no frame is ever
   painted in a theme the reader did not ask for. */
function palette(accentToken = "--green"): Palette {
  const root = document.documentElement;
  const had = root.getAttribute("data-theme");
  root.setAttribute("data-theme", "dark");

  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px";
  root.appendChild(probe);

  /* `color` is the trick. A custom property's computed value is
     the token TEXT, `color-mix(...)` and all; assigning it to a
     real colour property is what makes the browser resolve it, so
     this gets the same rgb the page would paint. */
  const resolve = (expr: string): string => {
    probe.style.color = expr;
    return getComputedStyle(probe).color || "#111";
  };
  const accent = resolve(`var(${accentToken}, var(--green))`);
  const panel = resolve("var(--panel-base)");
  const ink = resolve("var(--ink)");

  /* THE DRAWING'S OWN NINE, read the same way and off the same
     class the site draws them on. `.artwork` is where
     `@layer relief` declares them, and `--accent` is set on the
     probe so the mixes come out in the card's colour rather than
     in the colour of whatever page the admin happens to be on. */
  probe.className = "artwork";
  probe.style.setProperty("--accent", `var(${accentToken}, var(--green))`);
  const art: Record<string, string> = {};
  for (const token of ART_TOKENS) art[token] = resolve(`var(--art-${token})`);

  const out: Palette = {
    accent,
    hot: resolve(`color-mix(in oklab, var(${accentToken}, var(--green)) 74%, var(--ink))`),
    ground: resolve(`color-mix(in oklab, var(${accentToken}, var(--green)) 20%, var(--panel-base))`),
    sink: resolve(`color-mix(in oklab, var(${accentToken}, var(--green)) 8%, var(--panel-base))`),
    ink,
    soft: resolve("var(--ink-soft)"),
    art,
  };

  probe.remove();
  if (had) root.setAttribute("data-theme", had);
  else root.removeAttribute("data-theme");
  /* `panel` is read for its side effect on the two mixes above
     and is deliberately not returned: the ground and the sink are
     what a card is painted with. */
  void panel;
  return out;
}

/** A colour with an alpha put on it. Every value out of
    `palette()` is `rgb(r, g, b)` or `color(srgb ...)`, so this
    goes through the browser once more rather than parsing. */
const fade = (colour: string, alpha: number): string =>
  `color-mix(in srgb, ${colour} ${Math.round(alpha * 100)}%, transparent)`;

/** Break a line into lines that fit, and stop after `max` of them
    with an ellipsis rather than running off the card. */
function wrap(
  ctx: OffscreenCanvasRenderingContext2D, text: string, width: number, max: number,
): string[] {
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= width || !line) { line = next; continue; }
    lines.push(line);
    line = word;
    if (lines.length === max) break;
  }
  if (lines.length < max && line) lines.push(line);
  if (lines.length === max && words.length) {
    const last = lines[max - 1];
    const joined = lines.join(" ");
    if (joined.split(/\s+/).length < words.length) {
      let cut = last;
      while (cut && ctx.measureText(`${cut}…`).width > width) {
        cut = cut.replace(/\s*\S$/, "");
      }
      lines[max - 1] = `${cut}…`;
    }
  }
  return lines;
}

/* ============================================================
   THE ROOM, at 1200 by 630

   `next/components/card-art.tsx` puts ten layers behind every
   card on this site and `@layer relief` lights them. A pasted
   link used to get none of it: a flat two-stop gradient, one
   ring motif and a floor, which read as a template rather than
   as this place.

   Same ten layers, same order, same argument for each. What
   differs is only that a canvas has no cascade, so a gradient
   that is one line of CSS there is six here.

     sky     the ground and the horizon
     weave   the tooth of the material
     halo    the bloom the subject throws behind it
     rays    shafts of light from the top left
     far     the MOTIF: what is behind this subject
     floor   the plane it all stands on
     stage   the subject, and its reflection
     near    motes in front of it, out of focus
     spec    the highlight crossing the glass
     veil    the corners going down

   And then the card's own furniture on top: the scrim that seats
   the words, the accent rail every `<GoCard>` carries down its
   left edge, and the hairline rim.
   ============================================================ */

/** Where the subject stands. The drawings are 520 by 400 with the
    ground at y=300, so the whole box scales as one and the
    reflection knows where the floor is without measuring
    anything. Right of centre, because the words are on the left
    and a card is read from there. */
const STAGE = { x: 596, y: 22, w: 604, h: 465, ground: 22 + (300 / 400) * 465 };

/** A drawing, rasterised.

    The tokens are substituted rather than declared, so nothing
    has to resolve a custom property inside a blob. Returns null
    rather than throwing: a card with a room and no subject is a
    good card, and a card that failed to publish is not. */
async function drawingOf(
  body: string, art: Record<string, string>, w: number, h: number,
): Promise<ImageBitmap | null> {
  try {
    let svg = body;
    for (const [token, colour] of Object.entries(art)) {
      svg = svg.split(`var(--art-${token})`).join(colour);
    }
    /* Anything left is a token this file does not know about,
       which would paint black. Better nothing than a black
       rectangle where a picture should be. */
    if (svg.includes("var(--art-")) return null;

    const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" `
      + `viewBox="0 0 520 400" fill="none">${svg}</svg>`;

    /* THROUGH AN `<img>`, NOT `createImageBitmap` ON THE BLOB.

       That is the obvious way and it does not work: Chrome
       answers `InvalidStateError: The source image could not be
       decoded` for an SVG blob, because an SVG is a document
       rather than a bitmap format and the bitmap decoder has
       never handled one. An `HTMLImageElement` renders it,
       which is why every library that does this uses one.

       The cost is that this needs a document, and the note at
       the top of this file about one day running in a worker is
       now about everything here EXCEPT the drawings. Wrapped in
       the same try: a card with a room and nothing standing in
       it is a good card, and a card that failed to publish is
       not. */
    const url = URL.createObjectURL(new Blob([doc], { type: "image/svg+xml" }));
    try {
      const img = new Image(w, h);
      img.src = url;
      await img.decode();
      return await createImageBitmap(img);
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return null;
  }
}

/** A tiling stipple, which is the weave one order of magnitude
    below anything else on the card. Built once into a 6px tile
    and repeated, because a hundred thousand `arc()` calls is a
    card that takes a second to draw. */
function weaveOf(ctx: OffscreenCanvasRenderingContext2D, p: Palette): CanvasPattern | null {
  const tile = new OffscreenCanvas(7, 11);
  const t = tile.getContext("2d");
  if (!t) return null;
  t.fillStyle = fade(p.ink, 0.05);
  t.fillRect(1, 2, 1, 1);
  t.fillStyle = fade(p.sink, 0.07);
  t.fillRect(4, 7, 1, 1);
  return ctx.createPattern(tile, "repeat");
}

/** The subject, and the same subject upside down under it.

    The reflection is what puts a thing on a floor rather than in
    the air, and it is the one layer that has to be built in a
    second canvas: a vertical flip plus a fade is two operations
    and the second has to erase the first, which cannot be done
    on a canvas that already has a room painted on it. */
function drawStage(
  ctx: OffscreenCanvasRenderingContext2D, art: ImageBitmap,
): void {
  const { x, y, w, h, ground } = STAGE;

  const mirror = new OffscreenCanvas(w, h);
  const m = mirror.getContext("2d");
  if (m) {
    m.save();
    m.translate(0, h);
    m.scale(1, -1);
    m.drawImage(art, 0, 0, w, h);
    m.restore();
    /* Fading downwards, which after the flip is fading AWAY from
       the thing, so the reflection is strongest where it meets
       the object and gone a third of the way down. */
    const fadeOut = m.createLinearGradient(0, 0, 0, h);
    fadeOut.addColorStop(0, "rgba(0,0,0,1)");
    fadeOut.addColorStop(0.2, "rgba(0,0,0,0.42)");
    /* Gone by a third of the way down, not by the bottom. A
       reflection that reaches the foot of the card is a second
       copy of the drawing floating under the floor, which is
       what an arrow at the top of a subject looked like. */
    fadeOut.addColorStop(0.42, "rgba(0,0,0,0)");
    fadeOut.addColorStop(1, "rgba(0,0,0,0)");
    m.globalCompositeOperation = "destination-out";
    m.fillStyle = fadeOut;
    m.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.filter = "blur(2px)";
    /* Placed so the mirror's own ground line lands on the stage's,
       which is what makes it a reflection rather than a copy
       sitting somewhere below. */
    ctx.drawImage(mirror, x, ground - (h - (ground - y)));
    ctx.restore();
  }

  ctx.drawImage(art, x, y, w, h);
}

/** The rail, the ground, the light and the rim: everything a
    `<GoCard>` on this site has, at eight times the size. */
function drawMaterial(
  ctx: OffscreenCanvasRenderingContext2D, p: Palette, hasPhoto: boolean,
  drawn: { subject: ImageBitmap | null; motif: ImageBitmap | null },
): void {
  if (!hasPhoto) {
    /* ---- 1. sky ---- */
    const sky = ctx.createLinearGradient(0, 0, 220, SHARE_H);
    sky.addColorStop(0, p.ground);
    sky.addColorStop(0.52, p.sink);
    sky.addColorStop(1, p.sink);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, SHARE_W, SHARE_H);

    /* ---- 2. weave ---- */
    const weave = weaveOf(ctx, p);
    if (weave) {
      ctx.fillStyle = weave;
      ctx.fillRect(0, 0, SHARE_W, SHARE_H);
    }

    /* ---- 3. halo: the bloom the subject throws behind it ---- */
    const cx = STAGE.x + STAGE.w / 2;
    const halo = ctx.createRadialGradient(cx, 250, 10, cx, 250, 560);
    halo.addColorStop(0, fade(p.accent, 0.38));
    halo.addColorStop(0.5, fade(p.accent, 0.12));
    halo.addColorStop(1, fade(p.accent, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, SHARE_W, SHARE_H);

    /* ---- 4. rays, from the top left, which is where every
       highlight on this site comes from ---- */
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (const [at, width] of [[0.1, 108], [0.28, 62], [0.44, 148], [0.62, 74]]) {
      const rx = SHARE_W * at;
      const ray = ctx.createLinearGradient(rx, 0, rx + 260, SHARE_H);
      ray.addColorStop(0, fade(p.ink, 0.055));
      ray.addColorStop(1, fade(p.ink, 0));
      ctx.fillStyle = ray;
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.lineTo(rx + width, 0);
      ctx.lineTo(rx + width + 300, SHARE_H);
      ctx.lineTo(rx + 300, SHARE_H);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    /* ---- 5. far: the wall this kind of subject stands against.
       Blurred and faded, because it is a wall rather than a
       second picture. ---- */
    if (drawn.motif) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.filter = "blur(2.5px)";
      ctx.drawImage(drawn.motif, STAGE.x - 128, STAGE.y - 26,
        STAGE.w + 256, STAGE.h + 40);
      ctx.restore();
    }

    /* ---- 6. floor: every line aimed at ONE vanishing point,
       because parallel lines are a hatch ---- */
    const horizon = STAGE.ground;
    const line = ctx.createLinearGradient(0, 0, SHARE_W, 0);
    line.addColorStop(0, fade(p.hot, 0.05));
    line.addColorStop(0.6, fade(p.hot, 0.3));
    line.addColorStop(1, fade(p.hot, 0.08));
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(SHARE_W, horizon);
    ctx.stroke();

    ctx.strokeStyle = fade(p.hot, 0.09);
    ctx.lineWidth = 2;
    for (let x = -600; x < SHARE_W + 800; x += 116) {
      ctx.beginPath();
      ctx.moveTo(x, SHARE_H);
      ctx.lineTo(cx + (x - cx) * 0.24, horizon);
      ctx.stroke();
    }
    const far = ctx.createLinearGradient(0, horizon, 0, SHARE_H);
    far.addColorStop(0, fade(p.sink, 0.95));
    far.addColorStop(0.4, fade(p.sink, 0));
    far.addColorStop(1, fade(p.sink, 0.8));
    ctx.fillStyle = far;
    ctx.fillRect(0, horizon, SHARE_W, SHARE_H - horizon);

    /* ---- 7. stage ---- */
    if (drawn.subject) drawStage(ctx, drawn.subject);

    /* ---- 8. near: motes in front of it, out of focus ---- */
    ctx.save();
    ctx.filter = "blur(3px)";
    for (const [mx, my, r, a] of [
      [232, 96, 9, 0.24], [1042, 148, 7, 0.2], [742, 546, 11, 0.16],
      [452, 470, 6, 0.18], [1136, 402, 8, 0.14],
    ]) {
      ctx.fillStyle = fade(p.hot, a);
      ctx.beginPath();
      ctx.arc(mx, my, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* THE SCRIM, and it is a different shape with a photograph
     under it: over a picture it has to reach most of the way
     across to keep the words readable whatever the photograph is
     doing, and over the site's own ground it only has to seat the
     text. */
  const scrim = ctx.createLinearGradient(0, 0, SHARE_W, 0);
  scrim.addColorStop(0, fade(p.sink, hasPhoto ? 0.96 : 0.88));
  scrim.addColorStop(hasPhoto ? 0.56 : 0.46, fade(p.sink, hasPhoto ? 0.72 : 0.28));
  scrim.addColorStop(1, fade(p.sink, 0));
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, SHARE_W, SHARE_H);

  /* ---- 9. spec: the highlight crossing the glass ---- */
  const shaft = ctx.createLinearGradient(180, 0, 760, SHARE_H);
  shaft.addColorStop(0, fade(p.ink, 0));
  shaft.addColorStop(0.5, fade(p.ink, 0.06));
  shaft.addColorStop(1, fade(p.ink, 0));
  ctx.fillStyle = shaft;
  ctx.fillRect(0, 0, SHARE_W, SHARE_H);

  /* ---- 10. veil: the corners going down, as on every scene ---- */
  const veil = ctx.createRadialGradient(600, 300, 180, 600, 300, 760);
  veil.addColorStop(0, fade(p.sink, 0));
  veil.addColorStop(1, fade(p.sink, 0.6));
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, SHARE_W, SHARE_H);

  /* The accent rail every card on this site carries down its left
     edge, and the hairline rim round the whole thing. */
  ctx.fillStyle = p.accent;
  ctx.fillRect(0, 0, 10, SHARE_H);
  ctx.strokeStyle = fade(p.ink, 0.13);
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, SHARE_W - 2, SHARE_H - 2);
}

/** The words. The site's two faces, with the stacks it uses. */
function drawWords(
  ctx: OffscreenCanvasRenderingContext2D, p: Palette, words: CardWords,
): void {
  const LEFT = 74;
  const WIDTH = 620;
  ctx.textBaseline = "alphabetic";

  if (words.kicker) {
    ctx.font = '500 25px ui-monospace, "SFMono-Regular", Menlo, monospace';
    ctx.fillStyle = p.hot;
    ctx.fillText(String(words.kicker).toUpperCase().slice(0, 40), LEFT, 132);
  }

  if (words.title) {
    ctx.font = '600 62px Newsreader, Georgia, "Times New Roman", serif';
    ctx.fillStyle = p.ink;
    const lines = wrap(ctx, words.title, WIDTH, 3);
    lines.forEach((line, i) => ctx.fillText(line, LEFT, 236 + i * 76));
  }

  /* Where it came from, small, at the foot. A card that says who
     drew it is the whole reason for drawing one. */
  ctx.font = '500 23px ui-monospace, "SFMono-Regular", Menlo, monospace';
  ctx.fillStyle = fade(p.soft, 0.9);
  ctx.fillText("REIAD.CO.UK", LEFT, SHARE_H - 62);
}

/**
 * Draw the card: a 1200x630 JPEG.
 *
 * `src` has to be a path this site serves. The bytes are read back
 * through fetch, so a `data:` URL works too and somebody else's
 * URL will not. An empty `src` is allowed and means a card with
 * no photograph on it, which is a card this site can now draw for
 * every piece rather than only for the illustrated ones.
 */
export async function shareCardBlob(
  { src, focus = "centre" }: { src: string; focus?: Focus },
  words: CardWords = {},
  /** The drawing this piece wears, as the inside of an `<svg>`,
      and the wall behind it. Both optional: a card without them
      is the room with nothing standing in it, which is what a
      caller that cannot reach `/api/admin/art` gets and is still
      a card. `drawingFor()` below is what fetches them. */
  drawing: { subject?: string; motif?: string } = {},
): Promise<Blob> {
  const canvas = new OffscreenCanvas(SHARE_W, SHARE_H);
  /* Non-null rather than a guard, and the guard would be the lie:
     `getContext("2d")` on an OffscreenCanvas this code just made
     returns null only if a context of another kind was already
     taken on it, which cannot have happened one line after `new`. */
  const ctx = canvas.getContext("2d")!;
  const p = palette(accentOf(words));

  let drew = false;
  if (src) {
    const res = await fetch(src, { credentials: "same-origin" });
    if (!res.ok) throw new Error(String(res.status));
    const bitmap = await createImageBitmap(await res.blob());

    // Cover, not contain: a card with letterboxing down the sides
    // looks like a mistake, and every platform crops to fill anyway.
    const scale = Math.max(SHARE_W / bitmap.width, SHARE_H / bitmap.height);
    const w = bitmap.width * scale;
    const h = bitmap.height * scale;
    ctx.drawImage(bitmap, (SHARE_W - w) / 2, (OFFSET[focus] ?? OFFSET.centre)(h), w, h);
    bitmap.close();
    drew = true;
  }

  /* WAITING FOR THE FACES, and not waiting is how a card comes
     out in Times New Roman on a fast connection and in Newsreader
     on a slow one. `document.fonts` is not there in a worker,
     where this could one day run, so it is asked for rather than
     assumed. */
  try { await document?.fonts?.ready; } catch { /* no document */ }

  /* Rasterised at the size they are drawn at rather than at their
     own 520x400, so the strokes are the width the drawing asks
     for instead of being scaled up with everything else. */
  const drawnArt = drew ? { subject: null, motif: null } : {
    subject: drawing.subject
      ? await drawingOf(drawing.subject, p.art, STAGE.w, STAGE.h) : null,
    motif: drawing.motif
      ? await drawingOf(drawing.motif, p.art, STAGE.w + 256, STAGE.h + 40) : null,
  };

  drawMaterial(ctx, p, drew, drawnArt);
  drawWords(ctx, p, words);

  // JPEG deliberately. This is the one image on the site that is
  // fetched by something other than a browser.
  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.86 });
}

/**
 * The photo a card should be made from, out of an article body.
 *
 * The lead photo if one is marked, otherwise the first photo,
 * otherwise nothing, and the caller decides what nothing means: in
 * the Studio it means the section's own card.
 */
export function coverFromDocument(doc: Document): Cover {
  const marked = doc.querySelector("figure.lead-photo img, img.lead-photo");
  const img = marked ?? doc.querySelector("img");
  const src = img?.getAttribute("src") ?? "";
  const figure = img?.closest("figure");
  const focus: Focus = figure?.classList.contains("focus-top") ? "top"
    : figure?.classList.contains("focus-bottom") ? "bottom"
    : "centre";
  return { src, focus, own: !!src, lead: !!marked };
}

export const coverFromHTML = (html: unknown): Cover =>
  coverFromDocument(new DOMParser().parseFromString(String(html ?? ""), "text/html"));

/** Where a drawn card is kept, so one can be told from a raw photo
    long after it was made. uploadMedia() puts it under this slug. */
export const cardSlug = (slug: string): string => `${slug}-card`;

/** Is this cover a card this code drew? Anything else is a photo
    of unknown shape, in a format half the scrapers refuse. */
export const isDrawnCard = (url: string | null | undefined): boolean =>
  /^\/media\/[a-z0-9-]*-card\/[0-9a-f]+\.jpg$/.test(url ?? "");

/* What to say about the image in the tags. Twinned with cardShape()
   in functions/insights/[slug].ts, which has to say the same thing
   about a stored cover without a DOM to look at.

   Only two kinds of image are known to be 1200x630: a section's own
   card, and one drawn above. Declaring those dimensions for a photo
   of unknown shape is a lie that some platforms lay out around, so
   the tags are simply left off. */
const IMAGE_TYPES: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", avif: "image/avif", gif: "image/gif",
};

export const cardShape = (url: string | null | undefined): { type: string; sized: boolean } => ({
  /* `pop()` on a split is never undefined, and TypeScript cannot
     know that: a split of "" is [""], not []. The fallback below
     is what covers a URL with no extension at all. */
  type: IMAGE_TYPES[String(url ?? "").split(".").pop()!.toLowerCase()] ?? "image/png",
  sized: /^(https:\/\/reiad\.co\.uk)?\/og\/[a-z0-9-]+\.png$/.test(url ?? "")
    || isDrawnCard(String(url ?? "").replace("https://reiad.co.uk", "")),
});

/* ============================================================
   Where a drawing comes from

   `shared/art-svg.ts` holds the twelve subjects and the six walls
   and is deliberately not compiled into `aab/`: it is 34 KB and
   nobody needs it except whoever is publishing. `GET
   /api/admin/art` hands it over behind `isAdmin()`.

   Cached in this module for the life of the page, because a desk
   drawing forty missing cards in a row should ask once.
   ============================================================ */

/** What the endpoint answers with. */
interface ArtTable {
  subjects: Record<string, string>;
  motifs: Record<string, string>;
  motifOf: Record<string, string>;
}

interface ArtAnswer extends ArtTable { pick?: string | null }

let table: Promise<ArtTable | null> | null = null;

/** The drawings, once per page. Null on any failure, including
    not being an admin, and every caller treats null as "the room
    with nothing in it" rather than as an error: a card is worth
    having either way. */
export function artTable(): Promise<ArtTable | null> {
  table ??= fetch("/api/admin/art", { headers: { accept: "application/json" } })
    .then(async (res) => (res.ok ? await res.json() as ArtTable : null))
    .then((got) => (got?.subjects && got?.motifs ? got : null))
    .catch(() => null);
  return table;
}

/** The subject and its wall, by name. */
export async function drawingFor(
  subject: string,
): Promise<{ subject?: string; motif?: string }> {
  const got = await artTable();
  if (!got) return {};
  const wall = got.motifOf[subject];
  return {
    subject: got.subjects[subject],
    motif: wall ? got.motifs[wall] : undefined,
  };
}

/** What a PIECE wears, in one request.

    The choice is `shared/art.ts`'s and is made in the Worker,
    because a browser bundle cannot import that file and a second
    copy of the rule here would be two hubs drawing different
    cards for the same row. Everything is optional and every
    failure is `{}`, which the card reads as "the room with
    nothing standing in it".

    Not cached, unlike `artTable()`: the answer depends on which
    piece is being asked about. The drawings inside it are the
    same 34 KB every time and are the reason a caller drawing
    forty cards should use `artTable()` and `drawingFor()`
    instead. */
export async function drawingForPiece(src: {
  id?: string; section?: string; title?: string; tags?: Array<string | undefined>;
}): Promise<{ subject?: string; motif?: string }> {
  try {
    const q = new URLSearchParams();
    if (src.id) q.set("id", src.id);
    if (src.section) q.set("section", src.section);
    if (src.title) q.set("title", src.title);
    const tags = (src.tags ?? []).filter(Boolean).join(",");
    if (tags) q.set("tags", tags);

    const res = await fetch(`/api/admin/art?${q}`,
      { headers: { accept: "application/json" } });
    if (!res.ok) return {};
    const got = await res.json() as ArtAnswer;
    if (!got?.subjects || !got.pick) return {};
    const wall = got.motifOf[got.pick];
    return {
      subject: got.subjects[got.pick],
      motif: wall ? got.motifs[wall] : undefined,
    };
  } catch {
    return {};
  }
}
