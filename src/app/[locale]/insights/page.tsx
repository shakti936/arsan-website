import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  type IndexCard,
  InsightsIndex,
} from "@/components/sections/insights-index";
import { NewsletterBand } from "@/components/sections/newsletter-band";
import { PageHero } from "@/components/sections/page-hero";
import { TailoredBand } from "@/components/sections/tailored-band";
import { ARTICLES, articleCopy } from "@/content/insights";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.insights" });
  return pageMetadata({
    locale,
    path: "/insights",
    title: t("metaTitle"),
    description: t("intro"),
  });
}

/**
 * /insights, built to refs/dirA-insights-index.png: hero, the category bar
 * over a featured grid, the tailored-insights band and the newsletter.
 *
 * Copy is resolved here rather than in the client component — the grid needs
 * only the four strings it renders, so the whole `Article` (five sections of
 * prose, takeaways, a rail) never crosses into the bundle.
 */
export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.insights");

  const cards: IndexCard[] = ARTICLES.map((article) => {
    const copy = articleCopy(article, locale);
    return {
      slug: article.slug,
      categoryKey: article.categoryKey,
      photo: article.photo,
      published: article.published,
      readingMinutes: article.readingMinutes,
      title: copy.title,
      deck: copy.deck,
    };
  });

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        emphasis={t("titleEmphasis")}
        intro={t("intro")}
        photo="nav-automation"
      />
      <InsightsIndex cards={cards} />
      <TailoredBand />
      <NewsletterBand />
    </main>
  );
}
