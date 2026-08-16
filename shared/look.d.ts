/* Types for look.js, so the Next.js route can import the same
   table the Worker reads without a `@ts-expect-error` over the
   import. The reasoning is the same as app/src/types/README.md:
   silencing the complaint does not describe the module, and it
   silences the next complaint too. */

export interface Look {
  mount: string;
  bodyClass: string;
  og: string;
  minutes: (n: number) => string;
  skip: string;
  note: string;
  back: { url: string; kicker: string; label: string };
  side: { url: string; kicker: string; label: string };
  footer: string;
}

/** The row as the articles table holds it. */
export interface Article {
  slug: string;
  section: string;
  lang: string;
  title: string;
  dek: string;
  tag: string;
  body: string;
  cover: string;
  minutes: number;
  status: string;
  published_at: string;
  updated_at: string;
}

export const LOOK: Record<string, Look>;
export function lookFor(section: string): Look;
export function isSection(name: string): boolean;

export function cardShape(url: string): { type: string; sized: boolean };
export function coverFor(article: Partial<Article>): string;
export function dateLabel(article: Pick<Article, "lang" | "published_at">): string;

export const FONTS: string;

/** Every fact the head of an article page states. Both renderers
    build their tags from this, which is what makes "the Next route
    and the Worker agree" a thing a test can check rather than a
    thing a comment can ask for. */
export function headFacts(article: Article, origin: string): {
  look: Look;
  url: string;
  cover: string;
  image: string;
  sized: boolean;
  type: string;
  locale: string;
  title: string;
  jsonLd: string;
};
