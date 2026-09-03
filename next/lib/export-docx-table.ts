/* ============================================================
   lib/export-docx-table.ts: the table maker's grid as Word, in
   the browser. One real table, the first row its header, so it
   pastes into a thesis as a table rather than as tab-separated
   text. The `docx` library is loaded when the button is pressed
   and no other page pays for it. RESEARCH.md section 19.
   ============================================================ */

const BANGLA = /[ঀ-৿]/;

export async function tableDocx(o: { grid: string[][]; title?: string; bangla?: boolean }): Promise<Blob> {
  const D = await import("docx");
  const bangla = o.bangla ?? o.grid.some((r) => r.some((c) => BANGLA.test(c)));
  const font = bangla ? "Noto Sans Bengali" : "Times New Roman";
  const width = Math.max(1, ...o.grid.map((r) => r.length));
  const cell = (text: string, head: boolean) => new D.TableCell({
    width: { size: Math.floor(100 / width), type: D.WidthType.PERCENTAGE },
    children: [new D.Paragraph({ children: [new D.TextRun({ text, bold: head, font })] })],
  });
  /* Every row is padded to the widest, because a ragged row makes
     Word draw a table whose columns do not line up. */
  const rows = o.grid.map((r, i) => new D.TableRow({
    tableHeader: i === 0,
    children: Array.from({ length: width }, (_v, k) => cell(r[k] ?? "", i === 0)),
  }));
  const children: InstanceType<typeof D.Paragraph | typeof D.Table>[] = [];
  if (o.title) children.push(new D.Paragraph({ text: o.title, heading: D.HeadingLevel.HEADING_2 }));
  children.push(new D.Table({ rows, width: { size: 100, type: D.WidthType.PERCENTAGE } }));
  const doc = new D.Document({
    creator: "Research Studio",
    title: o.title ?? "Table",
    styles: { default: { document: { run: { font, size: 24 } } } },
    sections: [{ children }],
  });
  return D.Packer.toBlob(doc);
}
