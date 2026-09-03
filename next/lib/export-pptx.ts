/* ============================================================
   lib/export-pptx.ts: a kind-`slides` document as PowerPoint.

   One slide a heading, title and bullets straight from
   `slidesOf`: the same split the deck view and the print layout
   draw from, so what exports is what the reader already saw.
   RESEARCH.md section 16.
   ============================================================ */

import type { Slide } from "@reiad/shared/research-write";

/** 16:9 in PowerPoint's own inches, so nothing built here is a
    stretched 4:3 master. */
const LAYOUT = { name: "RS_16x9", width: 10, height: 5.63 };

export async function toPptx(o: { title: string; slides: Slide[] }): Promise<Blob> {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();
  pptx.defineLayout(LAYOUT);
  pptx.layout = LAYOUT.name;

  const cover = pptx.addSlide();
  cover.addText(o.title, { x: 0.5, y: 2, w: 9, h: 1.5, fontSize: 32, bold: true, align: "center" });

  for (const slide of o.slides) {
    const s = pptx.addSlide();
    s.addText(slide.title || "…", { x: 0.5, y: 0.35, w: 9, h: 0.9, fontSize: 28, bold: true });
    if (slide.bullets.length) {
      s.addText(
        slide.bullets.map((text) => ({ text, options: { bullet: true, breakLine: true } })),
        { x: 0.5, y: 1.4, w: 9, h: 3.8, fontSize: 18, valign: "top" },
      );
    }
  }

  return pptx.write({ outputType: "blob" }) as Promise<Blob>;
}
