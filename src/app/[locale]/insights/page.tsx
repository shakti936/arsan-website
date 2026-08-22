import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  type IndexCard,
  InsightsIndex,
  resolveTab,
} from "@/components/sections/insights-index";
import { NewsletterBand } from "@/components/sections/newsletter-band";
import { PageHero } from "@/components/sections/page-hero";
import { TailoredBand } from "@/components/sections/tailored-band";
import { listArticles } from "@/lib/articles";
import { pageMetadata } from "@/lib/site";

type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({
  params,
}: Pick<Params, "params">): Promise<Metadata> {
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
 * The grid asks Sanity for cards, not for articles: the index query projects
 * the six fields a card renders and never touches the body, so drawing this
 * page does not move five articles' worth of prose across the wire.
 *
 * Reading `?category=` here rather than in the browser makes the page dynamic,
 * and that is the point: every filtered view arrives as complete HTML on the
 * one page whose whole job is to be indexed and shared. Nothing is fetched to
 * render it — the articles are modules in this bundle — so "dynamic" costs a
 * render, not a round trip.
 */
export default async function Page({ params, searchParams }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category } = await searchParams;
  const t = await getTranslations("subpage.insights");

  const cards: IndexCard[] = await listArticles(locale);

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        emphasis={t("titleEmphasis")}
        intro={t("intro")}
        photo="nav-automation"
      />
      <InsightsIndex cards={cards} tab={resolveTab(category)} />
      <TailoredBand />
      <NewsletterBand />
    </main>
  );
}
