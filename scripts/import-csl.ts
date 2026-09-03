/* ============================================================
   import-csl.ts: the citation styles, vendored as strings.

     node scripts/import-csl.ts                 every style and the locale
     node scripts/import-csl.ts --only vancouver  one style, nothing else

   Fetches each style from the official Citation Style Language
   repository and the en-GB locale, and writes each as a TypeScript
   module under shared/csl/ exporting the XML as one string. A
   string rather than an .xml file beside it because nothing here
   serves a bare file from next/: the Next worker answers routes
   and aab/ is closed, so the one way to a style is to import it,
   and a module per style is a chunk per style, loaded when a
   document asks for it.

   The styles are CC BY-SA 3.0, (c) their authors, from
   https://github.com/citation-style-language/styles; the locale
   is from .../locales. The notice is written into each module.
   ============================================================ */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "shared", "csl");

/** id here → file in the styles repository. The id is what a
    document row stores in `style`. */
export const STYLES: Record<string, { file: string; name: string; was?: string }> = {
  apa: { file: "apa", name: "APA 7th" },
  harvard: { file: "harvard-cite-them-right", name: "Harvard (Cite Them Right)" },
  oscola: { file: "oscola", name: "OSCOLA" },
  "chicago-ad": { file: "chicago-author-date", name: "Chicago author-date" },
  "chicago-notes": { file: "chicago-notes-bibliography", name: "Chicago notes and bibliography", was: "chicago-note-bibliography" },
  mla: { file: "modern-language-association", name: "MLA 9th", was: "modern-language-association-9th-edition" },
  ieee: { file: "ieee", name: "IEEE" },
  vancouver: { file: "vancouver", name: "Vancouver", was: "vancouver-author-date" },
  "elsevier-harvard": { file: "elsevier-harvard", name: "Elsevier Harvard" },
  "emerald-harvard": { file: "emerald-harvard", name: "Emerald Harvard" },
};

const BASE = "https://raw.githubusercontent.com/citation-style-language/styles/master/";
/* The project's built distribution of the same styles, tried last:
   `vancouver.csl` answers 404 from `styles` and 200 from here. */
const DIST = "https://raw.githubusercontent.com/citation-style-language/styles-distribution/master/";
const LOCALE = "https://raw.githubusercontent.com/citation-style-language/locales/master/locales-en-GB.xml";

const module_ = (what: string, xml: string): string =>
  `/* ${what}, vendored by scripts/import-csl.ts. CC BY-SA 3.0, from the\n   Citation Style Language project. Do not edit; rerun the import. */\nexport default ${JSON.stringify(xml)};\n`;

const only = process.argv.indexOf("--only") > 0 ? process.argv[process.argv.indexOf("--only") + 1] : null;

mkdirSync(OUT, { recursive: true });
for (const [id, s] of Object.entries(STYLES)) {
  if (only && id !== only) continue;
  /* The repository renames a style now and then (chicago-note- became
     chicago-notes-); `was` is the old name, tried second, and the
     distribution repository third. */
  let res = await fetch(`${BASE}${s.file}.csl`);
  if (!res.ok && s.was) res = await fetch(`${BASE}${s.was}.csl`);
  if (!res.ok) res = await fetch(`${DIST}${s.file}.csl`);
  if (!res.ok) { console.warn(`  ${id.padEnd(18)} ${s.file}.csl: ${res.status}, not vendored`); continue; }
  writeFileSync(join(OUT, `${id}.ts`), module_(`${s.name} (${s.file}.csl)`, await res.text()));
  console.log(`  ${id.padEnd(18)} ${s.file}.csl`);
}
if (only) process.exit(0);
const loc = await fetch(LOCALE);
if (!loc.ok) throw new Error(`locale: ${loc.status}`);
writeFileSync(join(OUT, "locale-en-gb.ts"), module_("locales-en-GB.xml", await loc.text()));
console.log("  locale-en-gb      locales-en-GB.xml");
