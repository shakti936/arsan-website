import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { Icons } from "@/components/ui/icons";
import { alternatesFor } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "subpage.opportunities",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/for-candidates/opportunities"),
  };
}

/**
 * Live listings arrive with the job board (SOP D-023 — gated on the AIOS
 * scope change). Until then this is an honest empty state, not invented
 * roles: most ARSAN searches are confidential and never publicly posted.
 */
export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.opportunities");

  return (
    <main id="main">
      <PageHero title={t("title")} intro={t("intro")} />
      <section className="bg-white-warm section-y">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center border border-cream-100 bg-cream-50 p-10 text-center">
            <Icons.compass className="h-10 w-10 text-brass-500" />
            <h2 className="mt-5 font-display text-display-md font-semibold text-navy-900 text-balance">
              {t("emptyHeading")}
            </h2>
            <p className="mt-4 max-w-[52ch] text-base text-navy-800">
              {t("emptyBody")}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-6">
              <ArrowLink href="/for-candidates/talent-network">
                {t("emptyCtaNetwork")}
              </ArrowLink>
              <ArrowLink href="/for-candidates/submit-profile">
                {t("emptyCtaProfile")}
              </ArrowLink>
            </div>
          </div>
        </Container>
      </section>
      <CtaBand />
    </main>
  );
}
