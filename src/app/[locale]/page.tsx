import { setRequestLocale } from "next-intl/server";
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

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main>
      <Hero namespace="home.hero" />
      <LogoWall />
      <Chooser />
      <ValueProps />
      <QuoteBand namespace="home.quote" />
      <Stories />
      <TeamRow />
      <ArticleCards namespace="insightsRow" withViewAll />
      <CtaBand />
    </main>
  );
}
