import type { PortableTextBlock } from "next-sanity";
import type { IconName } from "@/lib/icon-names";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  articleIndexQuery,
  articleQuery,
  articleSlugsQuery,
} from "@/sanity/lib/queries";

/**
 * The article read path. Everything the site knows about articles comes
 * through here.
 *
 * One module rather than importing the Sanity client from six page files,
 * because "where does an article come from" should be answerable by opening
 * one file — and because the shape the components consume is a decision worth
 * making once. GROQ already resolves the locale and collapses link
 * destinations into hrefs, so nothing downstream ever sees a `{ en, es }`
 * object or a `destination`.
 *
 * Reads go through `sanityFetch` (see `sanity/lib/live.ts`), which serves
 * published content normally and switches to drafts when Next's draft mode is
 * on. That switch is what makes the Studio's Presentation tool show
 * unpublished work in place instead of a stale published page — and it lives
 * here, once, rather than in each of the six callers.
 *
 * `articleSlugs` is the exception and stays on the plain client: it runs inside
 * `generateStaticParams`, which is build time with no request and therefore no
 * draft mode to read. Prerendering the routes of unpublished articles would be
 * wrong anyway.
 */

export type ArticleBlock = PortableTextBlock;

export type ArticleImage = {
  url: string;
  alt: string;
  lqip: string | null;
  width: number;
  height: number;
};

export type ArticleCard = {
  slug: string;
  readingMinutes: number;
  categoryKey: string;
  published: string;
  featured: boolean | null;
  title: string;
  deck: string;
  image: ArticleImage;
};

export type ArticleView = ArticleCard & {
  body: ArticleBlock[];
  pullQuote: string | null;
  pullQuoteBy: string | null;
  pullQuoteOrg: string | null;
  stat: { figure: string; body: string; source: string } | null;
  asideHeading: string | null;
  asideItems: string[] | null;
  takeawaysHeading: string | null;
  takeaways: { icon: IconName; title: string; body: string }[] | null;
  seo: { title: string | null; description: string | null } | null;
};

async function fetch<T>(query: string, params: Record<string, unknown> = {}) {
  const { data } = await sanityFetch({ query, params });
  return data as T;
}

/**
 * Reading time, computed rather than stored — and computed from a character
 * count the QUERY produces, so the index can show it without fetching five
 * articles' worth of prose to count words in the browser.
 *
 * A stored `readingMinutes` is a number someone has to remember to change
 * every time they add three paragraphs, and nobody ever does: the hand-authored
 * values in the old content modules claimed 4–7 minutes for articles that are
 * 300–600 words, roughly double. 5.7 characters per word (English, spaces
 * included) at 200 words a minute.
 */
const CHARS_PER_MINUTE = 5.7 * 200;

function minutesFrom(characters: number | null | undefined): number {
  return Math.max(1, Math.round((characters ?? 0) / CHARS_PER_MINUTE));
}

/** What the queries return before `readingMinutes` is derived. */
type Raw<T> = Omit<T, "readingMinutes"> & { characters: number | null };

const withReadingTime = <T extends { readingMinutes: number }>(
  row: Raw<T>,
): T =>
  ({ ...row, readingMinutes: minutesFrom(row.characters) }) as unknown as T;

export async function articleSlugs(): Promise<string[]> {
  const rows = await client.fetch<{ slug: string }[]>(articleSlugsQuery);
  return rows.map((row) => row.slug);
}

export async function listArticles(locale: string): Promise<ArticleCard[]> {
  const rows = await fetch<Raw<ArticleCard>[]>(articleIndexQuery, { locale });
  return (rows ?? []).map(withReadingTime<ArticleCard>);
}

export async function getArticleView(
  slug: string,
  locale: string,
): Promise<ArticleView | null> {
  const article = await fetch<Raw<ArticleView> | null>(articleQuery, {
    slug,
    locale,
  });
  if (!article) return null;
  return withReadingTime<ArticleView>(article);
}

/**
 * Other articles to read next — newest first, excluding this one.
 *
 * Deliberately not "most similar". With five articles a similarity score is
 * theatre; recency is honest and it is what a reader who just finished one
 * piece is looking for.
 */
export async function relatedArticles(
  slug: string,
  locale: string,
  count = 4,
): Promise<ArticleCard[]> {
  const all = await listArticles(locale);
  return all.filter((article) => article.slug !== slug).slice(0, count);
}
