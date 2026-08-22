import type { IconName } from "@/components/ui/icons";

/**
 * Articles live in typed modules, not in `messages/*.json`.
 *
 * The house rule is that no user-facing string is hardcoded, and these obey it
 * — every field carries an `en` and an `es`. But a 1,200-word article split
 * across forty flat message keys is unreadable to write, unreviewable in a
 * diff, and gives the message validator forty more things to count. A module
 * keeps a piece in one place, in the order it is read, and the type makes a
 * missing translation a build error rather than a runtime `insights.3.steps.2`
 * showing through on the page.
 *
 * The shape follows refs/dirA-article-*.png, which all four comps share:
 * lede, a numbered spine, a close, three takeaways, and a rail.
 *
 * Prose fields accept one piece of inline markup, `[label](/path)`, so an
 * article can link into the service pages from inside a sentence. That is
 * where internal links actually carry weight; a rail of related links at the
 * bottom is not the same thing. Nothing else is parsed — no bold, no lists —
 * because every construct added here is one a translator can break.
 */
export type ArticleStep = { title: string; body: string };

export type ArticleTakeaway = {
  icon: IconName;
  title: string;
  body: string;
};

/**
 * The rail's figure card. **Optional and currently unset on every article** —
 * see the note in `index.ts`. When Armida supplies a sourced number it drops
 * straight in; until then the rail carries `aside` instead.
 */
export type ArticleStat = {
  figure: string;
  body: string;
  /** Publication and year. A figure without one does not render. */
  source: string;
};

export type ArticleCopy = {
  /** Display label, also the last breadcrumb crumb. */
  category: string;
  title: string;
  /** Standfirst under the headline. */
  deck: string;
  /** `<title>`. The headline is editorial; this one has to say what the page is. */
  metaTitle: string;
  metaDescription: string;
  imageAlt: string;
  /** Paragraphs before the first heading. */
  lede: string[];
  bodyHeading: string;
  steps: ArticleStep[];
  /** Optional H2 over the closing paragraphs — the market update's "What to watch". */
  outroHeading?: string;
  outro: string[];
  takeawaysHeading: string;
  takeaways: ArticleTakeaway[];
  pullQuote: string;
  pullQuoteBy: string;
  /** Rail card: the questions this piece should send a reader back to work with. */
  asideHeading: string;
  asideItems: string[];
  stat?: ArticleStat;
};

export type Article = {
  slug: string;
  /** basename in public/images, shared with the article's OG card */
  photo: string;
  /** ISO date. Feeds `datePublished` in the Article JSON-LD. */
  published: string;
  readingMinutes: number;
  en: ArticleCopy;
  es: ArticleCopy;
};
