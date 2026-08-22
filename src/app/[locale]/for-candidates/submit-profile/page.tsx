import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/lead-form";
import { IconRow } from "@/components/sections/icon-row";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "subpage.submitProfile",
  });
  return pageMetadata({
    locale,
    path: "/for-candidates/submit-profile",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.submitProfile");

  return (
    <main id="main">
      <PageHero title={t("title")} intro={t("intro")} />
      <section className="bg-white-warm section-y">
        <Container>
          <LeadForm kind="candidate" />
        </Container>
      </section>
      <IconRow
        namespace="candidateValues"
        icons={["handshake", "chat", "compass", "star"]}
        withHeading
      />
    </main>
  );
}
