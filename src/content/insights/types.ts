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
 * The shape follows refs/dirA-article-*.png. The body is a list of `sections`
 * rather than a fixed heading-plus-spine, because the comps show two different
 * body shapes and a page type that can only render one of them is a page type
 * that will be worked around. The four opinion pieces are one section with a
 * numbered spine plus a closing section of prose; the case study is three
 * prose sections, one of which carries a check list.
 *
 * Prose fields accept one piece of inline markup, `[label](/path)`, so an
 * article can link into the service pages from inside a sentence. That is
 * where internal links actually carry weight; a rail of related links at the
 * bottom is not the same thing. Nothing else is parsed — no bold, no lists —
 * because every construct added here is one a translator can break.
 */
export type ArticleStep = { title: string; body: string };

/** A circled-check line with a bold lead-in — refs/dirA-casestudy-vacant-to-victorious.png. */
export type ArticleCheck = { lead: string; body: string };

/**
 * One H2 and what sits under it. Everything is optional but the order is not:
 * prose, then a numbered spine or a check list. A section carries one list at
 * most; two lists under one heading is a second section.
 */
export type ArticleSection = {
  /** H2 over the section. */
  heading?: string;
  body?: string[];
  steps?: ArticleStep[];
  checks?: ArticleCheck[];
};

export type ArticleTakeaway = {
  icon: IconName;
  title: string;
  body: string;
};

/**
 * The rail's figure card. Optional, and every one currently in the build is
 * marked `@unverified` — see the note in `index.ts`. Deleting a `stat` is
 * always safe: the rail falls back to `aside`, so pulling an unsourced number
 * before launch costs one line and leaves no hole behind.
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
  sections: ArticleSection[];
  takeawaysHeading: string;
  takeaways: ArticleTakeaway[];
  pullQuote: string;
  pullQuoteBy: string;
  /** Second attribution line — the case study's "Precision Components Manufacturer". */
  pullQuoteOrg?: string;
  /** Rail fallback: the questions this piece should send a reader back to work with. */
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
