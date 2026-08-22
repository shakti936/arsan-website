import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CandidateClose } from "@/components/sections/candidate-close";
import { OpportunityBoard } from "@/components/sections/opportunity-board";
import { PageHero } from "@/components/sections/page-hero";
import { WhyWorkBand } from "@/components/sections/why-work-band";
import { listOpenings } from "@/lib/jobs";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

/**
 * Relative posting dates ("Posted 3 days ago") are rendered against the render
 * time, so a statically built page would drift a day per day. An hour is short
 * enough that nothing on the board is visibly stale and long enough that the
 * page is still effectively static — and it is the cadence the real ATS feed
 * will want anyway.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "subpage.opportunities",
  });
  return pageMetadata({
    locale,
    path: "/for-candidates/opportunities",
    title: t("title"),
    description: t("intro"),
  });
}

/**
 * The job board, from refs/dirA-job-board.png.
 *
 * Listings come from `listOpenings()`, which is the seam to the internal ATS
 * that will own jobs, candidates and clients (CLAUDE.md; SOP D-023, D-074).
 * Today it resolves fabricated openings from a fixture — `bun run
 * check:launch` fails while it does. This page does not change when the real
 * feed lands.
 */
export default async function Page({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subpage.opportunities");

  const now = Date.now();
  const openings = await listOpenings(now);

  return (
    <main id="main">
      <PageHero
        title={t("title")}
        emphasis="moves your career forward."
        intro={t("intro")}
        photo="story-mexico-expansion"
        primary={{
          label: t("closeCta"),
          href: "/for-candidates/submit-profile",
        }}
        secondary={{
          label: t("emptyCtaNetwork"),
          href: "/for-candidates/talent-network",
        }}
        badge={{ icon: "briefcase", text: t("eyebrowBadge") }}
      />
      <OpportunityBoard openings={openings} now={now} />
      <WhyWorkBand />
      <CandidateClose />
    </main>
  );
}
