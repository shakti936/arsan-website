import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArticleBody } from "@/components/sections/article-body";
import { ArticleHero } from "@/components/sections/article-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { NewsletterBand } from "@/components/sections/newsletter-band";
import { RelatedInsights } from "@/components/sections/related-insights";
import { ARTICLES, articleCopy, getArticle } from "@/content/insights";
import { routing } from "@/i18n/routing";
import { localeUrl, pageMetadata, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string; slug: string }> };

/**
 * Every article in every locale is known at build time, so all of them are
 * prerendered. Without this each one is a serverless invocation the first time
 * a crawler or a reader asks for it.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ARTICLES.map((article) => ({ locale, slug: article.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const copy = articleCopy(article, locale);

  return pageMetadata({
    locale,
    path: `/insights/${slug}`,
    title: copy.metaTitle,
    description: copy.metaDescription,
    publishedTime: article.published,
  });
}

export default async function Page({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticle(slug);
  if (!article) notFound();
  const copy = articleCopy(article, locale);
  const url = localeUrl(locale, `/insights/${slug}`);

  /**
   * Article and BreadcrumbList, emitted together in one graph.
   *
   * `headline` is the editorial title, not the `<title>` — Google shows this
   * one, and it should read the way the page reads. `author` and `publisher`
   * are the organization: these are written by ARSAN's editorial team rather
   * than by a named person, and inventing a byline to satisfy a schema field
   * would be a claim about a human being who doesn't exist.
   *
   * `dateModified` mirrors `datePublished` because nothing has been revised
   * yet. It has to move when an article does.
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
        datePublished: article.published,
        dateModified: article.published,
        articleSection: copy.category,
        image: [`${SITE_URL}/images/${article.photo}.jpg`],
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
            name: copy.category,
            item: localeUrl(locale, "/insights"),
          },
          { "@type": "ListItem", position: 3, name: copy.title, item: url },
        ],
      },
    ],
  };

  return (
    <main id="main">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other insertion point, and the payload is built here from typed content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHero
        copy={copy}
        photo={article.photo}
        published={article.published}
        readingMinutes={article.readingMinutes}
      />
      <ArticleBody copy={copy} />
      <RelatedInsights currentSlug={slug} locale={locale} />
      <CtaBand />
      <NewsletterBand />
    </main>
  );
}
