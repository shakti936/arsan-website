import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { ArticleCards } from "@/components/sections/article-cards";
import { Chooser } from "@/components/sections/chooser";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { LogoWall } from "@/components/sections/logo-wall";
import { QuoteBand } from "@/components/sections/quote-band";
import { Stories } from "@/components/sections/stories";
import { TeamRow } from "@/components/sections/team-row";
import { ValueProps } from "@/components/sections/value-props";
import { pageMetadata } from "@/lib/site";

/**
 * The home card is declared here rather than in the layout. Next's
 * `opengraph-image` file convention overrides `openGraph.images` coming from a
 * *layout* in the same segment — which put the auto-generated `/en/…` URL back
 * on the home page while every subpage kept its canonical one. Metadata from a
 * `page` wins, so this is where it belongs.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main id="main">
      <Hero namespace="home.hero" />
      <LogoWall />
      <Chooser />
      <ValueProps />
      <QuoteBand namespace="home.quote" />
      <Stories />
      <TeamRow withViewAll />
      <ArticleCards locale={locale} withViewAll />
      <CtaBand />
    </main>
  );
}
