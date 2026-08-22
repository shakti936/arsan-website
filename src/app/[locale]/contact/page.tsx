import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.contact" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.contact");

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        intro={t("intro")}
        photo="insight-hiring-mexico"
        // the shared primary is "Discuss a Search → /contact", which is here;
        // on a phone the form is a screen and a half down
        primary={{ label: t("heroCta"), href: "/contact#form" }}
      />
      <section id="form" className="scroll-mt-24 bg-white-warm section-y">
        <Container>
          <LeadForm kind="client" />
        </Container>
      </section>
    </main>
  );
}
