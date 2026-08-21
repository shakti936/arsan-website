import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { PointGrid } from "@/components/sections/point-grid";
import { alternatesFor } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "subpage.leadershipSolutions",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor(locale, "/for-clients/leadership-solutions"),
  };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.leadershipSolutions");
  const points = [0, 1, 2].map((i) => ({
    title: t(`points.${i}.title`),
    body: t(`points.${i}.body`),
  }));

  return (
    <main id="main">
      <PageHero title={t("title")} intro={t("intro")} />
      <PointGrid points={points} />
      <CtaBand />
    </main>
  );
}
