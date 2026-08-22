import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleCards } from "@/components/sections/article-cards";
import { Chooser, type ChooserCard } from "@/components/sections/chooser";
import { CtaBand } from "@/components/sections/cta-band";
import { FeaturedOpenings } from "@/components/sections/featured-openings";
import { IconRow } from "@/components/sections/icon-row";
import { PageHero } from "@/components/sections/page-hero";
import { TalentNetworkBand } from "@/components/sections/talent-network-band";
import { TrustStrip } from "@/components/sections/trust-strip";
import { featuredOpenings, listOpenings } from "@/lib/jobs";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

/** "How can ARSAN help?" — the four doors, in the comp's order. */
const HELP_CARDS: ChooserCard[] = [
  { href: "/for-candidates/opportunities", icon: "briefcase" },
  { href: "/for-candidates/submit-profile", icon: "document" },
  { href: "/for-candidates#experience", icon: "users" },
  { href: "/for-candidates/talent-network", icon: "person" },
];

/** Featured openings are live listings, so this follows the board's cadence. */
export const revalidate = 3600;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "subpage.forCandidates",
  });
  return pageMetadata({
    locale,
    path: "/for-candidates",
    title: t("title"),
    description: t("intro"),
  });
}

/**
 * /for-candidates, built to refs/dirA-for-candidates-landing.png: hero, trust
 * strip, featured opportunities, "You deserve to know where you stand.", the
 * four help cards, career insights, the talent-network band and the close.
 *
 * The lead form that used to sit at the bottom is gone. The comp does not have
 * one, and it was the same form /for-candidates/submit-profile exists to host
 * — two places to submit the same profile is two places to maintain and one
 * more decision than the page should ask for. Both closes now point there.
 */
export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.forCandidates");

  const openings = await listOpenings();

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        emphasis={t("titleEmphasis")}
        intro={t("intro")}
        photo="insight-leadership-teams"
        primary={{
          label: t("heroPrimary"),
          href: "/for-candidates/opportunities",
        }}
        secondary={{
          label: t("heroSecondary"),
          href: "/for-candidates/submit-profile",
        }}
      />
      <TrustStrip namespace="candidateTrust" />
      <FeaturedOpenings openings={featuredOpenings(openings)} />
      {/* the mega nav's "Candidate Experience" points here */}
      <IconRow
        id="experience"
        namespace="candidateValues"
        icons={["handshake", "chat", "chart", "personStar"]}
        withHeading
        headingLayout="beside"
      />
      <Chooser namespace="candidateHelp" cards={HELP_CARDS} />
      <ArticleCards
        locale={locale}
        withViewAll
        headingOverride={t("insightsHeading")}
        viewAllOverride={t("insightsViewAll")}
        className="bg-cream-50"
      />
      <TalentNetworkBand />
      <CtaBand
        namespace="ctaBandCandidates"
        href="/for-candidates/talent-network"
        secondary={{
          label: t("featuredViewAll"),
          href: "/for-candidates/opportunities",
        }}
      />
    </main>
  );
}
