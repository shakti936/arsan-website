import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/lead-form";
import { IconRow } from "@/components/sections/icon-row";
import { PageHero } from "@/components/sections/page-hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { alternatesFor } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "subpage.forCandidates",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/for-candidates"),
  };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.forCandidates");
  const th = await getTranslations("candidateHelp");

  return (
    <main id="main">
      <PageHero title={t("title")} intro={t("intro")} />
      <TrustStrip namespace="candidateTrust" />
      <IconRow
        namespace="candidateValues"
        icons={["handshake", "chat", "compass", "star"]}
        withHeading
      />
      <section className="bg-white-warm section-y">
        <Container>
          <h2 className="text-center font-display text-display-md font-semibold text-navy-900 text-balance">
            {th("heading")}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Reveal
                key={th(`items.${i}.title`)}
                delay={i * 0.06}
                className="h-full"
              >
                <div className="h-full border border-cream-100 bg-white-warm p-7 text-center shadow-sm shadow-navy-950/5">
                  <h3 className="font-display text-display-sm font-semibold text-navy-900">
                    {th(`items.${i}.title`)}
                  </h3>
                  <p className="mt-3 text-base text-navy-800">
                    {th(`items.${i}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <section id="conversation" className="bg-cream-50 section-y">
        <Container>
          <p className="max-w-[52ch] font-display text-display-md font-medium text-navy-900 text-balance">
            {t("ctaNote")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/for-candidates/opportunities">
              {t("ctaOpportunities")}
            </ButtonLink>
            <ButtonLink
              href="/for-candidates/submit-profile"
              variant="outline-dark"
            >
              {t("cta")}
            </ButtonLink>
          </div>
          <div className="mt-12">
            <LeadForm kind="candidate" />
          </div>
        </Container>
      </section>
    </main>
  );
}
