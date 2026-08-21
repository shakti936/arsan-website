import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { IconRow } from "@/components/sections/icon-row";
import { PageHero } from "@/components/sections/page-hero";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { alternatesFor } from "@/lib/site";

const CARD_HREFS = [
  "/for-clients/executive-search",
  "/for-clients/mexico-advisory",
  "/for-clients/leadership-solutions",
] as const;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.forClients" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/for-clients"),
  };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.forClients");

  return (
    <main id="main">
      <PageHero title={t("title")} intro={t("intro")} />
      <section className="bg-white-warm py-16 lg:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {CARD_HREFS.map((href, i) => (
              <Reveal key={href} delay={i * 0.08} className="h-full">
                <article className="flex h-full flex-col border border-cream-100 bg-white-warm p-8 shadow-sm shadow-navy-950/5">
                  <h2 className="font-display text-display-sm font-semibold leading-snug text-navy-900 text-balance">
                    {t(`cards.${i}.title`)}
                  </h2>
                  <p className="mt-4 flex-1 text-base text-navy-800">
                    {t(`cards.${i}.body`)}
                  </p>
                  <div className="mt-6">
                    <ArrowLink href={href}>{t(`cards.${i}.cta`)}</ArrowLink>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <IconRow
        namespace="whyCall"
        icons={["shield", "target", "map", "users"]}
        withHeading
      />
      <CtaBand />
    </main>
  );
}
