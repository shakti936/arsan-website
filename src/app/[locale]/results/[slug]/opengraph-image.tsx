import { notFound } from "next/navigation";
import {
  CASE_STUDIES,
  caseStudyCopy,
  getCaseStudy,
} from "@/content/case-studies";
import { routing } from "@/i18n/routing";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "ARSAN — Executive Search & Manufacturing Talent Advisory";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDIES.map((study) => ({ locale, slug: study.slug })),
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return ogImage({
    locale,
    photo: study.photo,
    title: caseStudyCopy(study, locale).title,
  });
}
