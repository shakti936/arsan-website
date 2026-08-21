import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { QuoteBand } from "@/components/sections/quote-band";
import { TeamRow } from "@/components/sections/team-row";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { alternatesFor } from "@/lib/site";

const SECTIONS = [
  { id: "difference", key: "difference" },
  { id: "people", key: "people" },
  { id: "how-we-work", key: "howWeWork" },
] as const;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.whyArsan" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/why-arsan"),
  };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.whyArsan");

  return (
    <main id="main">
      <PageHero title={t("title")} intro={t("intro")} />
      <section className="bg-white-warm py-16 lg:py-20">
        <Container className="flex flex-col gap-14">
          {SECTIONS.map((section) => (
            <Reveal key={section.id}>
              <div
                id={section.id}
                className="grid scroll-mt-24 gap-5 lg:grid-cols-[1fr_2fr]"
              >
                <SectionHeading>{t(`${section.key}.heading`)}</SectionHeading>
                <p className="max-w-[62ch] text-base leading-relaxed text-navy-800">
                  {t(`${section.key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>
      <TeamRow />
      <QuoteBand namespace="home.quote" />
      <CtaBand />
    </main>
  );
}
