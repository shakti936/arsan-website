import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.insights" });
  return { title: t("title"), description: t("intro") };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.insights");

  return (
    <main>
      <PageHero title={t("title")} intro={t("intro")} />
      <section className="bg-white-warm py-16">
        <Container>
          <p className="max-w-[58ch] text-base leading-relaxed text-navy-800">
            {t("comingSoon")}
          </p>
        </Container>
      </section>
      <CtaBand />
    </main>
  );
}
