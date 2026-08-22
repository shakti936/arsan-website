import { automationChangingManufacturingJobs } from "./automation-changing-manufacturing-jobs";
import { fromVacantToVictorious } from "./from-vacant-to-victorious";
import { manufacturingTalentMarketUpdate } from "./manufacturing-talent-market-update";
import { theNewManufacturingLeader } from "./the-new-manufacturing-leader";
import type { Article, ArticleCopy } from "./types";
import { whyTheBestCandidatesArentLooking } from "./why-the-best-candidates-arent-looking";

export type { Article, ArticleCopy, CategoryKey } from "./types";

/**
 * Every published article, newest first. This is the only list — the insights
 * index, the home row and each article's "Related Insights" all read from it,
 * so a new piece appears in three places by being added here once.
 *
 * **Every `stat` in here is unverified.** The comps each put a rail figure
 * sourced to Deloitte, LinkedIn or an "ARSAN Manufacturing Talent Market
 * Report" — 67%, 70%, 78%, 4.8%, and a 32% client outcome. Drew asked for the
 * comps reproduced exactly (D-071), so they are in the build and every one is
 * annotated `@unverified`; `bun run check:launch` fails while any is still
 * here. Verify each against the real report or delete it — the rail falls back
 * to the article's own questions, so removing one leaves no hole (SOP Q-23).
 */
export const ARTICLES: readonly Article[] = [
  manufacturingTalentMarketUpdate,
  fromVacantToVictorious,
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

/**
 * Everything except `slug`, in list order — for "Related Insights". Four is
 * what the comps show once the set is big enough to fill the row.
 */
export function relatedArticles(slug: string, count = 4): Article[] {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, count);
}
