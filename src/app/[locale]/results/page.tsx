import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CaseStudyGrid } from "@/components/sections/case-study-grid";
import { ImpactStrip } from "@/components/sections/impact-strip";
import { MoreWays } from "@/components/sections/more-ways";
import { type HeroStat, PageHero } from "@/components/sections/page-hero";
import { ResultsQuote } from "@/components/sections/results-quote";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

/** The hero's four figures, in the comp's order. */
const STAT_ICONS = ["users", "bars", "calendar", "trend"] as const;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.results" });
  return pageMetadata({
    locale,
    path: "/results",
    title: t("metaTitle"),
    description: t("intro"),
  });
}

/**
 * /results, built to refs/dirA-results-page.png: hero with four figures, the
 * area-of-impact strip, the case-study grid, one testimonial, and the four
 * routes out.
 *
 * It does not close on the site's teal CTA band — this comp closes on "More
 * ways we deliver results" instead, which is the right ending for a page whose
 * job is to send a reader somewhere more specific rather than to a form.
 */
export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.results");
  const tr = await getTranslations("resultsPage");

  // @unverified: the hero figures (200+ placements, 100+ clients, 30-45 day time to fill) are invented by the results comp — ARSAN has never counted them
  const stats: HeroStat[] = STAT_ICONS.map((icon, i) => ({
    icon,
    // `figure` and `unit` are each absent on one card — the numeral-only ones
    // have no unit, and "Measurable Impact" has no numeral
    figure: tr.has(`stats.${i}.figure`) ? tr(`stats.${i}.figure`) : undefined,
    unit: tr.has(`stats.${i}.unit`) ? tr(`stats.${i}.unit`) : undefined,
    label: tr(`stats.${i}.label`),
    note: tr.has(`stats.${i}.note`) ? tr(`stats.${i}.note`) : undefined,
  }));

  return (
    <main id="main">
      <PageHero
        eyebrow={tr("eyebrow")}
        title={t("title")}
        emphasis={t("titleEmphasis")}
        intro={tr("intro")}
        photo="hero-plant-floor"
        secondary={{ label: tr("ctaApproach"), href: "/why-arsan" }}
        stats={stats}
      />
      <ImpactStrip />
      <CaseStudyGrid locale={locale} />
      <ResultsQuote />
      <MoreWays />
    </main>
  );
}
