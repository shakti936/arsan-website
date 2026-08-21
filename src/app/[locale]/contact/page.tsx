import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.contact" });
  return { title: t("title"), description: t("intro") };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.contact");

  return (
    <main>
      <PageHero title={t("title")} intro={t("intro")} />
      <section className="bg-white-warm py-16">
        <Container>
          {/* GHL-backed "Discuss a Search" form lands here (next build phase). */}
          <p className="max-w-[58ch] border-l-2 border-brass-500 pl-5 text-base leading-relaxed text-navy-800">
            {t("formNote")}
          </p>
        </Container>
      </section>
    </main>
  );
}
