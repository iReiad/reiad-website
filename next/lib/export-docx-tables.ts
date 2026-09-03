/* ============================================================
   lib/export-docx-tables.ts: tables as Word, in the browser.

   A title, then one heading and one real table per entry, so a
   methods section can paste the search log and the extraction
   sheet as tables rather than as tab-separated text. The `docx`
   library builds the file here, loaded only when a button is
   pressed, and nothing is sent anywhere. Generic on purpose: any
   room with rows to print calls `tablesDocx()`. RESEARCH.md
   section 13.
   ============================================================ */

export interface DocTable {
  /** The heading over the table. */
  name: string;
  head: string[];
  rows: string[][];
}

export async function tablesDocx(title: string, tables: DocTable[], o: { bangla?: boolean; creator?: string } = {}): Promise<Blob> {
  const D = await import("docx");
  const font = o.bangla ? "Noto Sans Bengali" : "Times New Roman";
  const text = (s: string, bold = false) => new D.Paragraph({ children: [new D.TextRun({ text: s, bold, font })] });
  const cell = (s: string, bold = false) => new D.TableCell({ children: [text(s, bold)] });
  const children: (InstanceType<typeof D.Paragraph> | InstanceType<typeof D.Table>)[] = [];
  children.push(new D.Paragraph({ text: title, heading: D.HeadingLevel.TITLE }));
  for (const t of tables) {
    children.push(new D.Paragraph({ text: t.name, heading: D.HeadingLevel.HEADING_1 }));
    /* Every row is padded to the head's width: a short row would
       make Word draw a ragged table and some readers refuse it. */
    const width = t.head.length;
    const pad = (r: string[]): string[] => [...r, ...Array.from({ length: Math.max(0, width - r.length) }, () => "")].slice(0, width);
    children.push(new D.Table({
      width: { size: 100, type: D.WidthType.PERCENTAGE },
      rows: [
        new D.TableRow({ tableHeader: true, children: t.head.map((h) => cell(h, true)) }),
        ...t.rows.map((r) => new D.TableRow({ children: pad(r).map((v) => cell(v)) })),
      ],
    }));
    children.push(new D.Paragraph({ text: "" }));
  }
  const doc = new D.Document({
    creator: o.creator ?? "Research Studio",
    title,
    styles: { default: { document: { run: { font, size: 22 } } } },
    sections: [{ children }],
  });
  return D.Packer.toBlob(doc);
}
