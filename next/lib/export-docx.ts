/* ============================================================
   lib/export-docx.ts: a document as Word, in the browser.

   Real headings, real footnotes, a real bibliography, from the
   same HTML the desk edits. The `docx` library builds the file
   here; nothing is sent anywhere. RESEARCH.md section 16.
   ============================================================ */

import { notesOf } from "@reiad/shared/research-write";

interface Run { text: string; bold?: boolean; italics?: boolean; footnote?: number }

const unescape = (s: string): string =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

/** Inline HTML to runs: bold, italics, and a footnote marker
    where a marker was. Everything else is its text. */
function runsOf(html: string): Run[] {
  const out: Run[] = [];
  const re = /<sup><a\b[^>]*fn-ref[^>]*href="#fn-(\d+)"[^>]*>[\s\S]*?<\/a><\/sup>|<(strong|b|em|i)>([\s\S]*?)<\/\2>|<[^>]+>|[^<]+/gi;
  for (const m of html.matchAll(re)) {
    if (m[1]) out.push({ text: "", footnote: Number(m[1]) });
    else if (m[2]) out.push({ text: unescape(m[3].replace(/<[^>]+>/g, "")), bold: /^(strong|b)$/i.test(m[2]), italics: /^(em|i)$/i.test(m[2]) });
    else if (!m[0].startsWith("<")) out.push({ text: unescape(m[0]) });
  }
  return out.filter((r) => r.text || r.footnote);
}

export async function toDocx(o: {
  title: string; html: string; bibliography: string; author?: string; affiliation?: string; bangla?: boolean;
}): Promise<Blob> {
  const D = await import("docx");
  const notes = notesOf(o.html);
  const font = o.bangla ? "Noto Sans Bengali" : "Times New Roman";
  const runs = (html: string) => runsOf(html).map((r) => r.footnote
    ? new D.FootnoteReferenceRun(r.footnote)
    : new D.TextRun({ text: r.text, bold: r.bold, italics: r.italics, font }));
  const children: InstanceType<typeof D.Paragraph>[] = [];
  children.push(new D.Paragraph({ text: o.title, heading: D.HeadingLevel.TITLE }));
  if (o.author) children.push(new D.Paragraph({ children: [new D.TextRun({ text: o.author, font })] }));
  if (o.affiliation) children.push(new D.Paragraph({ children: [new D.TextRun({ text: o.affiliation, italics: true, font })] }));
  const body = o.html.replace(/<ol\b[^>]*class="[^"]*\bfn\b[^"]*"[^>]*>[\s\S]*?<\/ol>/i, "");
  for (const m of body.matchAll(/<(h2|h3|p|blockquote|ul|ol|div)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = m[1].toLowerCase();
    if (tag === "h2") children.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: runs(m[2]) }));
    else if (tag === "h3") children.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_2, children: runs(m[2]) }));
    else if (tag === "blockquote") children.push(new D.Paragraph({ indent: { left: 720, right: 720 }, children: runs(m[2]) }));
    else if (tag === "ul" || tag === "ol") {
      for (const li of m[2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
        children.push(new D.Paragraph({ bullet: tag === "ul" ? { level: 0 } : undefined, numbering: tag === "ol" ? { reference: "list", level: 0 } : undefined, children: runs(li[1]) }));
      }
    } else if (tag === "div" && /class="[^"]*\bbib\b/.test(m[0])) { /* below */ }
    else { const r = runs(m[2]); if (r.length) children.push(new D.Paragraph({ children: r })); }
  }
  if (o.bibliography) {
    children.push(new D.Paragraph({ text: "References", heading: D.HeadingLevel.HEADING_1 }));
    for (const entry of o.bibliography.matchAll(/<div class="csl-entry">([\s\S]*?)<\/div>/gi)) {
      children.push(new D.Paragraph({ indent: { left: 720, hanging: 720 }, children: runs(entry[1]) }));
    }
  }
  const footnotes: Record<number, { children: InstanceType<typeof D.Paragraph>[] }> = {};
  notes.forEach((n, i) => { footnotes[i + 1] = { children: [new D.Paragraph({ children: runs(n) })] }; });
  const doc = new D.Document({
    creator: o.author ?? "Research Studio",
    title: o.title,
    numbering: { config: [{ reference: "list", levels: [{ level: 0, format: D.LevelFormat.DECIMAL, text: "%1.", alignment: D.AlignmentType.START }] }] },
    footnotes,
    styles: { default: { document: { run: { font, size: 24 } } } },
    sections: [{ children }],
  });
  return D.Packer.toBlob(doc);
}
