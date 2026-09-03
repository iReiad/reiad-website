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

/** A table's rows, cell by cell, off its own markup: `<figure>`
    holds either the SVG a run drew or a table `toHtml` built from
    an APA fit's rows (shared/research-lab.ts), and only the
    second carries anything Word can lay out as a table. */
function tableRows(html: string): string[][] {
  const rows: string[][] = [];
  for (const tr of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells: string[] = [];
    for (const cell of tr[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)) cells.push(unescape(cell[1].replace(/<[^>]+>/g, "")).trim());
    if (cells.length) rows.push(cells);
  }
  return rows;
}

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
  const children: (InstanceType<typeof D.Paragraph> | InstanceType<typeof D.Table>)[] = [];
  children.push(new D.Paragraph({ text: o.title, heading: D.HeadingLevel.TITLE }));
  if (o.author) children.push(new D.Paragraph({ children: [new D.TextRun({ text: o.author, font })] }));
  if (o.affiliation) children.push(new D.Paragraph({ children: [new D.TextRun({ text: o.affiliation, italics: true, font })] }));
  const body = o.html.replace(/<ol\b[^>]*class="[^"]*\bfn\b[^"]*"[^>]*>[\s\S]*?<\/ol>/i, "");
  for (const m of body.matchAll(/<(h2|h3|p|blockquote|ul|ol|div|figure)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = m[1].toLowerCase();
    if (tag === "h2") children.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: runs(m[2]) }));
    else if (tag === "h3") children.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_2, children: runs(m[2]) }));
    else if (tag === "blockquote") children.push(new D.Paragraph({ indent: { left: 720, right: 720 }, children: runs(m[2]) }));
    else if (tag === "ul" || tag === "ol") {
      for (const li of m[2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
        children.push(new D.Paragraph({ bullet: tag === "ul" ? { level: 0 } : undefined, numbering: tag === "ol" ? { reference: "list", level: 0 } : undefined, children: runs(li[1]) }));
      }
    } else if (tag === "div" && /class="[^"]*\bbib\b/.test(m[0])) { /* below */ }
    else if (tag === "figure") {
      /* A figure from a run: its table, where it holds one, as a
         real Word table, and its caption under it either way. Its
         SVG is not rasterised here; the caption still carries. */
      const table = /<table\b[\s\S]*?<\/table>/i.exec(m[2]);
      const trows = table ? tableRows(table[0]) : [];
      if (trows.length) {
        children.push(new D.Table({
          rows: trows.map((r) => new D.TableRow({
            children: r.map((c) => new D.TableCell({ children: [new D.Paragraph({ children: [new D.TextRun({ text: c, font })] })] })),
          })),
        }) as unknown as InstanceType<typeof D.Paragraph>);
      }
      const cap = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i.exec(m[2]);
      if (cap) children.push(new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: runs(cap[1]).map((r) => (r instanceof D.TextRun ? new D.TextRun({ text: (r as InstanceType<typeof D.TextRun>).text as unknown as string, italics: true, font }) : r)) }));
    }
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
