import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleCards } from "@/components/sections/article-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { FeaturedCase } from "@/components/sections/featured-case";
import { IconRow } from "@/components/sections/icon-row";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { alternatesFor } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "subpage.mexicoAdvisory",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/for-clients/mexico-advisory"),
  };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.mexicoAdvisory");
  const tq = await getTranslations("mexicoQuestions");

  return (
    <main id="main">
      <PageHero title={t("title")} intro={t("intro")} />
      <section className="bg-white-warm py-16 lg:py-20">
        <Container>
          <h2 className="mx-auto max-w-[30ch] text-center font-display text-display-md font-semibold text-navy-900 text-balance">
            {tq("heading")}
          </h2>
          <p className="mx-auto mt-5 max-w-[62ch] text-center text-base leading-relaxed text-navy-800">
            {tq("intro")}
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Reveal
                key={tq(`items.${i}.title`)}
                delay={i * 0.06}
                className="h-full"
              >
                <div className="h-full border border-cream-100 bg-white-warm p-6 shadow-sm shadow-navy-950/5">
                  <h3 className="font-display text-2xl font-semibold leading-snug text-navy-900 text-balance">
                    {tq(`items.${i}.title`)}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-navy-800">
                    {tq(`items.${i}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <FeaturedCase namespace="mexicoCase" />
      <IconRow
        namespace="mexicoEarly"
        icons={["target", "chart", "star", "globe"]}
        withHeading
      />
      <ArticleCards namespace="insightsRow" withViewAll />
      <CtaBand />
    </main>
  );
}
