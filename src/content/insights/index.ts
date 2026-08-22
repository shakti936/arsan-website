import { automationChangingManufacturingJobs } from "./automation-changing-manufacturing-jobs";
import { manufacturingTalentMarketUpdate } from "./manufacturing-talent-market-update";
import { theNewManufacturingLeader } from "./the-new-manufacturing-leader";
import type { Article, ArticleCopy } from "./types";
import { whyTheBestCandidatesArentLooking } from "./why-the-best-candidates-arent-looking";

export type { Article, ArticleCopy } from "./types";

/**
 * Every published article, newest first. This is the only list — the insights
 * index, the home row and each article's "Related Insights" all read from it,
 * so a new piece appears in three places by being added here once.
 *
 * **No article carries a `stat`.** The four comps each show a rail figure
 * sourced to Deloitte, LinkedIn or an "ARSAN Manufacturing Talent Market
 * Report" — 67%, 70%, 78%, 4.8%. None of those exist. Attributing an invented
 * number to a real research firm is the kind of thing a competitor screenshots,
 * so the slot is wired and empty; the rail carries the article's questions
 * instead. Fill `stat` when Armida provides sourced data (SOP Q-06).
 */
export const ARTICLES: readonly Article[] = [
  manufacturingTalentMarketUpdate,
  theNewManufacturingLeader,
  automationChangingManufacturingJobs,
  whyTheBestCandidatesArentLooking,
] as const;

export const ARTICLE_SLUGS = ARTICLES.map((a) => a.slug);

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** The locale's copy, falling back to English for an unknown locale. */
export function articleCopy(article: Article, locale: string): ArticleCopy {
  return locale === "es" ? article.es : article.en;
}

/** Everything except `slug`, in list order — for "Related Insights". */
export function relatedArticles(slug: string, count = 3): Article[] {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, count);
}
