import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Stories } from "@/components/sections/stories";
import { Testimonials } from "@/components/sections/testimonials";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.results" });
  return pageMetadata({
    locale,
    path: "/results",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.results");
  const tr = await getTranslations("resultsPage");
  const tn = await getTranslations("nav");

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        intro={t("intro")}
        photo="hero-plant-floor"
        // the shared secondary is "See our work → /results", which is here
        secondary={{ label: tn("whyArsan.label"), href: "/why-arsan" }}
      />
      <Stories headingOverride={tr("storiesHeading")} />
      <Testimonials />
      <CtaBand />
    </main>
  );
}
