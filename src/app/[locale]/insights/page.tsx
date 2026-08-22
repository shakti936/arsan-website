import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleCards } from "@/components/sections/article-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.insights" });
  return pageMetadata({
    locale,
    path: "/insights",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.insights");

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        emphasis={t("titleEmphasis")}
        intro={t("intro")}
        photo="nav-automation"
      />
      <ArticleCards locale={locale} count={6} />
      <CtaBand />
    </main>
  );
}
