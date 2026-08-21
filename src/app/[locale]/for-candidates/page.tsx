import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHero } from "@/components/sections/page-hero";
import { PointGrid } from "@/components/sections/point-grid";
import { Container } from "@/components/ui/container";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "subpage.forCandidates",
  });
  return { title: t("title"), description: t("intro") };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.forCandidates");
  const points = [0, 1, 2].map((i) => ({
    title: t(`points.${i}.title`),
    body: t(`points.${i}.body`),
  }));

  return (
    <main>
      <PageHero title={t("title")} intro={t("intro")} />
      <PointGrid points={points} />
      <section id="conversation" className="bg-cream-50 py-16">
        <Container>
          <p className="max-w-[52ch] font-display text-display-md font-medium leading-snug text-navy-900 text-balance">
            {t("ctaNote")}
          </p>
          <div className="mt-10">
            <LeadForm kind="candidate" />
          </div>
        </Container>
      </section>
    </main>
  );
}
