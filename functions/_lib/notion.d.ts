/* ============================================================
   _lib/notion.d.ts: what `notion.test.ts` imports, and nothing
   else.

   `notion.js` is still JavaScript. Everything else the test
   touches is `.ts` already, so this is the one place TypeScript
   needs a claim about a module that carries no types of its own,
   and the answer is a description rather than a `@ts-expect-error`
   for the same reason `app/src/types/README.md` gives: silencing
   the complaint describes nothing, and silences the next one too.

   DELIBERATELY PARTIAL: the six exports the test imports, and no
   others. `client`, `fetchBlocks`, `esc`, `proxyURL`, `pageTitle`,
   `FIELD_NAMES`, `MAX_BLOCK_FETCHES` and `MAX_DEPTH` are real and
   are not here, because a description written past what something
   reads is a description nothing holds to the module. `sync.js`
   and `api/notion/[[route]].js` import those and are JavaScript,
   so nothing typechecks them either way.

   This file goes when `notion.js` becomes `notion.ts`, which is
   the entry `MIGRATION.md` carries for it. A module that has been
   converted describes itself.
   ============================================================ */

/** One run of Notion rich text. */
export interface RichText {
  plain_text?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
  };
  href?: string | null;
  text?: { link?: { url?: string } | null } | null;
}

/** A block, which carries its own data under a key named by its
    type: a paragraph has a `paragraph`. That is what the index
    signature is, rather than a way of allowing anything. */
export interface Block {
  id?: string;
  type?: string;
  has_children?: boolean;
  [data: string]: unknown;
}

/** The client `convert` is handed: a path in, Notion's answer out.
    The test passes a fake one, which is the whole reason this
    module takes it as an argument. */
export type NotionFetch = (path: string) => Promise<{
  results?: Block[];
  has_more?: boolean;
  next_cursor?: string | null;
}>;

/** Shared across one import, so the recursion counts its fetches
    against a single budget. `truncated` is how a half-converted
    page says so. */
export interface ConvertState {
  fetches: number;
  truncated: boolean;
}

/** One property of a Notion page, whatever type it happens to be. */
export interface NotionProperty {
  type?: string;
  title?: RichText[];
  rich_text?: RichText[];
  select?: { name?: string } | null;
  multi_select?: Array<{ name?: string }>;
  date?: { start?: string } | null;
  checkbox?: boolean;
}

/** What a page's columns come out as.

    `dek` and `status` are whatever the column was, because a
    multi-select answers a list and neither is folded back into a
    string. `tag`, `topics`, `date`, `lang` and `slug` are, which
    is why they are narrower here. */
export interface Fields {
  title: string;
  dek: string | string[];
  tag: string;
  slug: string;
  date: string;
  lang: "bn" | "en";
  status: string | string[];
  topics: string[];
}

export function inline(rich: RichText[] | undefined): string;
export function textOf(rich: RichText[] | undefined): string;
export function normaliseId(raw: unknown): string | null;
export function propValue(prop: NotionProperty | undefined): string | string[];
export function readFields(properties?: Record<string, NotionProperty>): Fields;
export function convert(
  blocks: Block[],
  options: {
    notion: NotionFetch;
    origin: string;
    state: ConvertState;
    depth?: number;
  },
): Promise<string>;
