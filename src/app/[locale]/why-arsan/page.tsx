import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { IconRow } from "@/components/sections/icon-row";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { QuoteBand } from "@/components/sections/quote-band";
import { TeamRow } from "@/components/sections/team-row";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

const PROCESS_STEPS = 4;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subpage.whyArsan" });
  return pageMetadata({
    locale,
    path: "/why-arsan",
    title: t("title"),
    description: t("intro"),
  });
}

/**
 * /why-arsan. No comp exists for this page, so it is built from the vocabulary
 * the comps established elsewhere rather than a fourth layout: the divided
 * icon strip from /for-candidates, the numbered process from the confidential
 * case study, the leadership row from the home page.
 *
 * It was three headings each followed by one sentence — the flattest page on
 * the site, and the one making the firm's argument for itself. A visitor
 * arriving from the mega nav at `#difference` landed on a single line.
 *
 * Section order follows the mega panel, so the panel reads as this page's
 * contents rather than as a different ordering of the same three ideas.
 */
export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.whyArsan");

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        emphasis={t("titleEmphasis")}
        intro={t("intro")}
        photo="story-transformation"
      />
      <IconRow
        id="difference"
        namespace="subpage.whyArsan.difference"
        icons={["factory", "globe", "person", "compass"]}
        withHeading
        headingLayout="beside"
        columns={2}
      />
      <TeamRow id="people" intro={t("peopleIntro")} />
      <ProcessSteps
        id="how-we-work"
        namespace="subpage.whyArsan.process"
        count={PROCESS_STEPS}
      />
      <QuoteBand namespace="home.quote" />
      <CtaBand />
    </main>
  );
}
