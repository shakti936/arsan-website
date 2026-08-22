import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { IconRow } from "@/components/sections/icon-row";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceCards } from "@/components/sections/service-cards";
import { Stories } from "@/components/sections/stories";
import { ValueProps } from "@/components/sections/value-props";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.forClients" });
  return pageMetadata({
    locale,
    path: "/for-clients",
    title: t("metaTitle"),
    description: t("intro"),
  });
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.forClients");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("ctaBandForClients");

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        emphasis={t("titleEmphasis")}
        intro={t("intro")}
        photo="hero-plant-floor"
        // the comp's own buttons, not the shared defaults
        primary={{ label: t("heroCtaPrimary"), href: "/contact" }}
        secondary={{ label: tn("whyArsan.label"), href: "/why-arsan" }}
      />
      <ServiceCards />
      <IconRow
        namespace="whyCall"
        icons={["shield", "target", "map", "users", "puzzle"]}
        withHeading
      />
      <ValueProps />
      <Stories headingOverride={t("storiesHeading")} />
      <CtaBand
        namespace="ctaBandForClients"
        secondary={{
          label: tc("secondary"),
          href: "/for-clients/executive-search",
        }}
      />
    </main>
  );
}
