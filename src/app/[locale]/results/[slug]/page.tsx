import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CaseStudy } from "@/components/sections/case-study";
import { JsonLd } from "@/components/seo/json-ld";
import {
  CASE_STUDIES,
  caseStudyCopy,
  getCaseStudy,
} from "@/content/case-studies";
import { routing } from "@/i18n/routing";
import { localeUrl, pageMetadata, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDIES.map((study) => ({ locale, slug: study.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const copy = caseStudyCopy(study, locale);

  return pageMetadata({
    locale,
    path: `/results/${slug}`,
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

export default async function Page({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const study = getCaseStudy(slug);
  if (!study) notFound();
  const copy = caseStudyCopy(study, locale);
  const url = localeUrl(locale, `/results/${slug}`);

  /**
   * `Article` rather than `CaseStudy` — schema.org has no case-study type, and
   * Article is what search engines actually consume for this shape.
   *
   * No `datePublished`. An engagement date is a fact about a client's
   * timeline, and none was supplied; a date invented to satisfy a schema field
   * is still an invented date. Article accepts the omission.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: copy.title,
        description: copy.metaDescription,
        inLanguage: locale === "es" ? "es-MX" : "en-US",
        articleSection: "Case Study",
        image: [`${SITE_URL}/images/${study.photo}.jpg`],
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Organization", name: "ARSAN", url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: "ARSAN",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo/arsan-lockup-navy.png`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ARSAN",
            item: localeUrl(locale, "/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Results",
            item: localeUrl(locale, "/results"),
          },
          { "@type": "ListItem", position: 3, name: copy.title, item: url },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <JsonLd data={jsonLd} />
      <CaseStudy copy={copy} photo={study.photo} variant={study.variant} />
    </main>
  );
}
