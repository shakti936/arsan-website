import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CandidateClose } from "@/components/sections/candidate-close";
import { OpportunityDetail } from "@/components/sections/opportunity-detail";
import { listOpenings, openingCopy, similarOpenings } from "@/lib/jobs";
import { pageMetadata } from "@/lib/site";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 3600;

/**
 * A single opening.
 *
 * No `generateStaticParams` and no `dynamicParams = false`, unlike the case
 * studies and articles: those are a fixed set this repo owns, and openings are
 * not. The ATS will open and close roles without a deploy, so the route has to
 * render a slug the build has never seen, and 404 for one that has closed.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const opening = (await listOpenings()).find((o) => o.slug === slug);
  if (!opening) return {};

  const copy = openingCopy(opening, locale);
  const t = await getTranslations({
    locale,
    namespace: "subpage.opportunity",
  });

  return pageMetadata({
    locale,
    path: `/for-candidates/opportunities/${slug}`,
    title: `${copy.title} — ${copy.company}`,
    description: `${copy.location}. ${copy.summary} ${t("confidentialNote")}`,
  });
}

export default async function Page({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const openings = await listOpenings();
  const opening = openings.find((o) => o.slug === slug);
  if (!opening) notFound();

  return (
    <main id="main">
      <OpportunityDetail
        opening={opening}
        similar={similarOpenings(openings, opening)}
      />
      <CandidateClose />
    </main>
  );
}
