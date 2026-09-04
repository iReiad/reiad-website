/* share-card.ts: the picture a pasted link shows, drawn once at
   publish as a real 1200x630 JPEG. JPEG because the scrapers
   behind WhatsApp, Facebook and LinkedIn will not read the WebP
   every photo here is stored as, and 1200x630 because otherwise
   each of them crops a photo whichever way it likes.
   It is drawn as this site rather than as a photograph, and
   always in the DARK palette: a JPEG in a chat window cannot
   answer a theme. The palette is READ off `<html>` held at dark
   for one synchronous style read, so a change to the site's
   greens reaches the cards with nobody remembering this file.
   Edit this; `aab/share-card.js` beside it is built. */
export const SHARE_W = 1200;
export const SHARE_H = 630;
/** Which part of the photo to keep when the crop throws some away. */
const OFFSET = {
    top: () => 0,
    bottom: (h) => SHARE_H - h,
    centre: (h) => (SHARE_H - h) / 2,
};
/** A section's colour, out of the rail. Returns a token name so
    the stylesheet is what resolves it. */
function accentOf(words) {
    if (words.accent)
        return words.accent;
    if (!words.section || typeof document === "undefined")
        return "--green";
    const link = document.querySelector(`.rail-item[href="/${words.section}"], .rail-item[href^="/${words.section}/"]`);
    const inline = link instanceof HTMLElement
        ? link.style.getPropertyValue("--accent").trim() : "";
    /* `var(--rose)` back to `--rose`, because `palette()` builds
       `var(<token>, var(--green))` round it and a nested `var()`
       inside a fallback is legal but pointless. */
    const named = /^var\(\s*(--[a-z-]+)/.exec(inline);
    return named ? named[1] : "--green";
}
/** The nine tokens the twelve drawings and six walls between them
    actually name. Asserted against the strings by
    `scripts/check-art.ts`, so a drawing that reaches for a tenth
    fails a check rather than rendering that shape in black. */
export const ART_TOKENS = [
    "lit", "hot", "mid", "deep", "shade", "sink",
    "fore-hot", "fore-lit", "fore-mid",
];
/* The dark palette is the card's palette, whatever the person
   publishing has their own site set to: see the note at the top.
   `<html>` is held at dark for the length of one synchronous
   read, with nothing awaited in between, so no frame is ever
   painted in a theme the reader did not ask for. */
function palette(accentToken = "--green") {
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
    const resolve = (expr) => {
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
    const art = {};
    for (const token of ART_TOKENS)
        art[token] = resolve(`var(--art-${token})`);
    const out = {
        accent,
        hot: resolve(`color-mix(in oklab, var(${accentToken}, var(--green)) 74%, var(--ink))`),
        ground: resolve(`color-mix(in oklab, var(${accentToken}, var(--green)) 20%, var(--panel-base))`),
        sink: resolve(`color-mix(in oklab, var(${accentToken}, var(--green)) 8%, var(--panel-base))`),
        ink,
        soft: resolve("var(--ink-soft)"),
        art,
    };
    probe.remove();
    if (had)
        root.setAttribute("data-theme", had);
    else
        root.removeAttribute("data-theme");
    /* `panel` is read for its side effect on the two mixes above
       and is deliberately not returned: the ground and the sink are
       what a card is painted with. */
    void panel;
    return out;
}
/** A colour with an alpha put on it. Every value out of
    `palette()` is `rgb(r, g, b)` or `color(srgb ...)`, so this
    goes through the browser once more rather than parsing. */
const fade = (colour, alpha) => `color-mix(in srgb, ${colour} ${Math.round(alpha * 100)}%, transparent)`;
/** Break a line into lines that fit, and stop after `max` of them
    with an ellipsis rather than running off the card. */
function wrap(ctx, text, width, max) {
    const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width <= width || !line) {
            line = next;
            continue;
        }
        lines.push(line);
        line = word;
        if (lines.length === max)
            break;
    }
    if (lines.length < max && line)
        lines.push(line);
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
/* THE ROOM, at 1200 by 630: the same ten layers, in the same
   order, that `next/components/card-art.tsx` puts behind every
   card here. Sky, weave, halo, rays, far, floor, stage, near,
   spec, veil, then the card's own furniture: the scrim, the
   accent rail every `<GoCard>` carries and the hairline rim.
   A canvas has no cascade, so one line of CSS there is six here. */
/* NO TWO CARDS THE SAME, and never a random number: the
   composition is DERIVED from the piece's own id, through the
   same hash `shared/art.ts` picks the subject with. A card has to
   be the same card every time it is drawn, or republishing moves
   the picture under a link somebody has already shared. Eleven
   numbers come out of it and none changes what the card IS. */
/** FNV-1a with the finaliser, which is `shared/art.ts`'s hash and
    has to be: two files disagreeing about what an id hashes to
    would be a card whose subject and whose room were chosen for
    different pieces. Written out rather than imported because
    `shared/` is not on the wire for a browser module, and it is
    six lines. */
function hash(seed) {
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i += 1) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    /* The finaliser, and it is not optional. FNV-1a avalanches
       badly in its LOW bits and every read below is a fraction, so
       without this a run of consecutive slugs comes out with the
       same composition. `shared/art.ts` says the same thing where
       it reads a pool. */
    h ^= h >>> 16;
    h = Math.imul(h, 0x7feb352d);
    h ^= h >>> 15;
    h = Math.imul(h, 0x846ca68b);
    h ^= h >>> 16;
    return h >>> 0;
}
/** A stream of fractions off one seed, read from the TOP bits for
    the reason above. */
function dice(seed) {
    let h = hash(seed);
    return (lo, hi) => {
        h = hash(String(h));
        return lo + (h >>> 8) / 0x1000000 * (hi - lo);
    };
}
function composeFor(seed) {
    const d = dice(seed || "reiad");
    /* The subject box. The drawings are 520 by 400 with the ground
       at y = 300, so the whole box scales as one and the reflection
       knows where the floor is without measuring anything. Right of
       centre always, because the words are on the left and a card
       is read from there: what moves is how far right and how big,
       which is the difference between standing back and stepping
       forward. */
    const w = d(548, 648);
    const h = w * (465 / 604);
    const x = d(560, 1200 - w + 34);
    const y = d(6, 46);
    const horizon = y + (300 / 400) * h;
    return {
        horizon,
        pitch: d(0.14, 0.34),
        stage: { x, y, w, h },
        halo: { x: x + w / 2 + d(-70, 70), y: d(190, 300), r: d(470, 640) },
        rays: [0, 1, 2, 3].map((i) => [d(0.02, 0.22) + i * 0.19, d(52, 156)]),
        motes: [0, 1, 2, 3, 4].map(() => [d(120, 1160), d(60, 580), d(5, 12), d(0.1, 0.26)]),
        wall: { dx: d(-150, -80), dy: d(-40, 10), scale: d(1.3, 1.7), alpha: d(0.38, 0.6) },
    };
}
/** A drawing, rasterised.

    The tokens are substituted rather than declared, so nothing
    has to resolve a custom property inside a blob. Returns null
    rather than throwing: a card with a room and no subject is a
    good card, and a card that failed to publish is not. */
async function drawingOf(body, art, w, h) {
    try {
        let svg = body;
        for (const [token, colour] of Object.entries(art)) {
            svg = svg.split(`var(--art-${token})`).join(colour);
        }
        /* Anything left is a token this file does not know about,
           which would paint black. Better nothing than a black
           rectangle where a picture should be. */
        if (svg.includes("var(--art-"))
            return null;
        const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" `
            + `viewBox="0 0 520 400" fill="none">${svg}</svg>`;
        /* THROUGH AN `<img>`, NOT `createImageBitmap` ON THE BLOB.
           Chrome answers `InvalidStateError: The source image could
           not be decoded` for an SVG blob: an SVG is a document
           rather than a bitmap format. Wrapped in the same try, since
           a card with an empty room still publishes. */
        const url = URL.createObjectURL(new Blob([doc], { type: "image/svg+xml" }));
        try {
            const img = new Image(w, h);
            img.src = url;
            await img.decode();
            return await createImageBitmap(img);
        }
        finally {
            URL.revokeObjectURL(url);
        }
    }
    catch {
        return null;
    }
}
/** A tiling stipple, which is the weave one order of magnitude
    below anything else on the card. Built once into a 6px tile
    and repeated, because a hundred thousand `arc()` calls is a
    card that takes a second to draw. */
function weaveOf(ctx, p) {
    const tile = new OffscreenCanvas(7, 11);
    const t = tile.getContext("2d");
    if (!t)
        return null;
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
function drawStage(ctx, art, c) {
    const { x, y, w, h } = c.stage;
    const ground = c.horizon;
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
        fadeOut.addColorStop(0.36, "rgba(0,0,0,0)");
        fadeOut.addColorStop(1, "rgba(0,0,0,0)");
        m.globalCompositeOperation = "destination-out";
        m.fillStyle = fadeOut;
        m.fillRect(0, 0, w, h);
        ctx.save();
        /* CLIPPED TO BELOW THE FLOOR, which is the one thing a
           reflection must never break: the mirror is the whole box
           flipped, so its top half is the empty space under the
           subject and would paint back over the subject's own feet.
           Mostly transparent, and "mostly" is not a promise. */
        ctx.beginPath();
        ctx.rect(0, ground, SHARE_W, SHARE_H - ground);
        ctx.clip();
        ctx.globalAlpha = 0.22;
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
function drawMaterial(ctx, p, hasPhoto, drawn, c) {
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
        const cx = c.stage.x + c.stage.w / 2;
        const halo = ctx.createRadialGradient(c.halo.x, c.halo.y, 10, c.halo.x, c.halo.y, c.halo.r);
        halo.addColorStop(0, fade(p.accent, 0.38));
        halo.addColorStop(0.5, fade(p.accent, 0.12));
        halo.addColorStop(1, fade(p.accent, 0));
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, SHARE_W, SHARE_H);
        /* ---- 4. rays, from the top left, which is where every
           highlight on this site comes from ---- */
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (const [at, width] of c.rays) {
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
            ctx.globalAlpha = c.wall.alpha;
            ctx.filter = "blur(2.5px)";
            ctx.drawImage(drawn.motif, c.stage.x + c.wall.dx, c.stage.y + c.wall.dy, c.stage.w * c.wall.scale, c.stage.h * c.wall.scale);
            ctx.restore();
        }
        /* ---- 6. floor: every line aimed at ONE vanishing point,
           because parallel lines are a hatch ---- */
        const horizon = c.horizon;
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
            ctx.lineTo(cx + (x - cx) * c.pitch, horizon);
            ctx.stroke();
        }
        const far = ctx.createLinearGradient(0, horizon, 0, SHARE_H);
        far.addColorStop(0, fade(p.sink, 0.95));
        far.addColorStop(0.4, fade(p.sink, 0));
        far.addColorStop(1, fade(p.sink, 0.8));
        ctx.fillStyle = far;
        ctx.fillRect(0, horizon, SHARE_W, SHARE_H - horizon);
        /* ---- 7. stage ---- */
        if (drawn.subject)
            drawStage(ctx, drawn.subject, c);
        /* ---- 8. near: motes in front of it, out of focus ---- */
        ctx.save();
        ctx.filter = "blur(3px)";
        for (const [mx, my, r, a] of c.motes) {
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
function drawWords(ctx, p, words) {
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
 * Draw the card: a 1200x630 JPEG. `src` has to be a path this
 * site serves (a `data:` URL works, somebody else's URL will
 * not), and an empty one means a card with no photograph.
 */
export async function shareCardBlob({ src, focus = "centre" }, words = {}, 
/** The drawing this piece wears, as the inside of an `<svg>`,
    and the wall behind it. Both optional: a card without them
    is the room with nothing standing in it, which is what a
    caller that cannot reach `/api/admin/art` gets and is still
    a card. `drawingFor()` below is what fetches them. */
drawing = {}) {
    const canvas = new OffscreenCanvas(SHARE_W, SHARE_H);
    /* Non-null rather than a guard, and the guard would be the lie:
       `getContext("2d")` on an OffscreenCanvas this code just made
       returns null only if a context of another kind was already
       taken on it, which cannot have happened one line after `new`. */
    const ctx = canvas.getContext("2d");
    const p = palette(accentOf(words));
    /* The composition, off the piece's own id. `seed` rather than
       the title, for the reason `shared/art.ts` gives beside its
       own hash: a title moves on a typo fix and the picture must
       not. Falls back to the title only because two callers have
       nothing else. */
    const c = composeFor(words.seed || words.title || "");
    let drew = false;
    if (src) {
        const res = await fetch(src, { credentials: "same-origin" });
        if (!res.ok)
            throw new Error(String(res.status));
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
    try {
        await document?.fonts?.ready;
    }
    catch { /* no document */ }
    /* Rasterised at the size they are drawn at rather than at their
       own 520x400, so the strokes are the width the drawing asks
       for instead of being scaled up with everything else. */
    const drawnArt = drew ? { subject: null, motif: null } : {
        subject: drawing.subject
            ? await drawingOf(drawing.subject, p.art, c.stage.w, c.stage.h) : null,
        motif: drawing.motif
            ? await drawingOf(drawing.motif, p.art, c.stage.w * c.wall.scale, c.stage.h * c.wall.scale) : null,
    };
    drawMaterial(ctx, p, drew, drawnArt, c);
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
export function coverFromDocument(doc) {
    const marked = doc.querySelector("figure.lead-photo img, img.lead-photo");
    const img = marked ?? doc.querySelector("img");
    const src = img?.getAttribute("src") ?? "";
    const figure = img?.closest("figure");
    const focus = figure?.classList.contains("focus-top") ? "top"
        : figure?.classList.contains("focus-bottom") ? "bottom"
            : "centre";
    return { src, focus, own: !!src, lead: !!marked };
}
export const coverFromHTML = (html) => coverFromDocument(new DOMParser().parseFromString(String(html ?? ""), "text/html"));
/** Where a drawn card is kept, so one can be told from a raw photo
    long after it was made. uploadMedia() puts it under this slug. */
export const cardSlug = (slug) => `${slug}-card`;
/** Is this cover a card this code drew? Anything else is a photo
    of unknown shape, in a format half the scrapers refuse. */
export const isDrawnCard = (url) => /^\/media\/[a-z0-9-]*-card\/[0-9a-f]+\.jpg$/.test(url ?? "");
/* What to say about the image in the tags. Twinned with cardShape()
   in functions/insights/[slug].ts, which has to say the same thing
   about a stored cover without a DOM to look at.

   Only two kinds of image are known to be 1200x630: a section's own
   card, and one drawn above. Declaring those dimensions for a photo
   of unknown shape is a lie that some platforms lay out around, so
   the tags are simply left off. */
const IMAGE_TYPES = {
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    webp: "image/webp", avif: "image/avif", gif: "image/gif",
};
export const cardShape = (url) => ({
    /* `pop()` on a split is never undefined, and TypeScript cannot
       know that: a split of "" is [""], not []. The fallback below
       is what covers a URL with no extension at all. */
    type: IMAGE_TYPES[String(url ?? "").split(".").pop().toLowerCase()] ?? "image/png",
    sized: /^(https:\/\/reiad\.co\.uk)?\/og\/[a-z0-9-]+\.png$/.test(url ?? "")
        || isDrawnCard(String(url ?? "").replace("https://reiad.co.uk", "")),
});
let table = null;
/** The drawings, once per page. Null on any failure, including
    not being an admin, and every caller treats null as "the room
    with nothing in it" rather than as an error: a card is worth
    having either way. */
export function artTable() {
    table ??= fetch("/api/admin/art", { headers: { accept: "application/json" } })
        .then(async (res) => (res.ok ? await res.json() : null))
        .then((got) => (got?.subjects && got?.motifs ? got : null))
        .catch(() => null);
    return table;
}
/** The subject and its wall, by name. */
export async function drawingFor(subject) {
    const got = await artTable();
    if (!got)
        return {};
    const wall = got.motifOf[subject];
    return {
        subject: got.subjects[subject],
        motif: wall ? got.motifs[wall] : undefined,
    };
}
/** What a PIECE wears, in one request. The choice is
    `shared/art.ts`'s and is made in the WORKER: a browser bundle
    cannot import that file, and a second copy of the rule here
    would be two hubs drawing different cards for one row. Every
    failure is `{}`, which the card reads as an empty room.
    Not cached: a caller drawing forty cards should use
    `artTable()` and `drawingFor()` instead. */
export async function drawingForPiece(src) {
    try {
        const q = new URLSearchParams();
        if (src.id)
            q.set("id", src.id);
        if (src.section)
            q.set("section", src.section);
        if (src.title)
            q.set("title", src.title);
        const tags = (src.tags ?? []).filter(Boolean).join(",");
        if (tags)
            q.set("tags", tags);
        const res = await fetch(`/api/admin/art?${q}`, { headers: { accept: "application/json" } });
        if (!res.ok)
            return {};
        const got = await res.json();
        if (!got?.subjects || !got.pick)
            return {};
        const wall = got.motifOf[got.pick];
        return {
            subject: got.subjects[got.pick],
            motif: wall ? got.motifs[wall] : undefined,
        };
    }
    catch {
        return {};
    }
}
